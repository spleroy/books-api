const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Book = require("../models/Book");
const booksRouter = require("../routes/books"); 

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  app = express();
  app.use(express.json());
  app.use("/books", booksRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Book.deleteMany();
});

describe("Books API", () => {
  it("should create a new book (POST /books)", async () => {
    const newBook = {
      title: "Test Book",
      author: "John Doe",
      genre: "Fiction",
      read: false,
    };

    const response = await request(app).post("/books").send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newBook);

    const bookInDb = await Book.findOne({ title: "Test Book" });
    expect(bookInDb).not.toBeNull();
    expect(bookInDb.author).toBe("John Doe");
  });

  it("should get all books (GET /books)", async () => {
    const books = [
      { title: "Book A", author: "Alice", genre: "Fiction", read: false },
      { title: "Book B", author: "Bob", genre: "Non-fiction", read: true },
    ];

    await Book.insertMany(books);

    const response = await request(app).get("/books");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it("should get a single book by id (GET /books/:id)", async () => {
    const book = new Book({
      title: "Single Book",
      author: "Author",
      genre: "Genre",
      read: false,
    });
    await book.save();

    const response = await request(app).get(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Single Book");
  });

  it("should update a book (PUT /books/:id)", async () => {
    const book = new Book({
      title: "Book to Update",
      author: "Author",
      genre: "Genre",
      read: false,
    });
    await book.save();

    const updatedData = { read: true };

    const response = await request(app).put(`/books/${book._id}`).send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.read).toBe(true);

    const updatedBookInDb = await Book.findById(book._id);
    expect(updatedBookInDb.read).toBe(true);
  });

  it("should delete a book (DELETE /books/:id)", async () => {
    const book = new Book({
      title: "Book to Delete",
      author: "Author",
      genre: "Genre",
      read: false,
    });
    await book.save();

    const response = await request(app).delete(`/books/${book._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted/i);

    const deletedBookInDb = await Book.findById(book._id);
    expect(deletedBookInDb).toBeNull();
  });

  it("should search for books (GET /books?search=)", async () => {
    await Book.insertMany([
      { title: "Book One", author: "Alice Wonderland", genre: "Fiction", read: false },
      { title: "Another Book", author: "Bob Builder", genre: "Non-fiction", read: true },
    ]);

    const response = await request(app).get("/books?search=another");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Another Book");
  });

  describe("Filtering and Sorting", () => {
    beforeEach(async () => {
      const books = [
        { title: "Zeta", author: "Anna Smith", genre: "Mystery", read: true },
        { title: "Alpha", author: "John Doe", genre: "Science", read: false },
        { title: "Gamma", author: "Bob Builder", genre: "Fiction", read: true },
        { title: "Beta", author: "Carol Jones", genre: "Fiction", read: false },
      ];
      await Book.insertMany(books);
    });

    it("should filter books by read status (GET /books?read=true)", async () => {
      const response = await request(app).get("/books?read=true");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      response.body.forEach((book) => {
        expect(book.read).toBe(true);
      });
    });

    it("should sort books by title in ascending order (GET /books?sort=title_asc)", async () => {
      const response = await request(app).get("/books?sort=title_asc");

      expect(response.status).toBe(200);
      const titles = response.body.map((book) => book.title);
      const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
      expect(titles).toEqual(sortedTitles);
    });

    it("should sort books by genre in descending order (GET /books?sort=genre_desc)", async () => {
      const response = await request(app).get("/books?sort=genre_desc");

      expect(response.status).toBe(200);
      const genres = response.body.map((book) => book.genre);
      const sortedGenres = [...genres].sort((a, b) => b.localeCompare(a));
      expect(genres).toEqual(sortedGenres);
    });

    it("should sort books by author last name in ascending order (GET /books?sort=author_asc)", async () => {
      const response = await request(app).get("/books?sort=author_asc");

      expect(response.status).toBe(200);
      const booksWithLastName = response.body.map((book) => {
        const authorParts = book.author.split(" ");
        return { ...book, lastName: authorParts[authorParts.length - 1] };
      });
      const sortedByLastName = [...booksWithLastName].sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );

      expect(booksWithLastName.map(b => b.lastName)).toEqual(sortedByLastName.map(b => b.lastName));
     });
   }); 
});
