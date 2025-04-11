const express = require("express");
const router = express.Router();
const Book = require("../models/Book");


//CREATE
router.post("/", async (req, res) => {
    try{
        const book = new Book(req.body);
        const savedBook = await book.save();

        res.status(201).json(savedBook);
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

//READ (all books)
router.get("/", async (req, res) => {
  try {
    let match = {};
    if (req.query.search) {
      match.$or = [
        { author: { $regex: req.query.search, $options: "i" } },
        { title: { $regex: req.query.search, $options: "i" } }
      ];
    }
    if (req.query.read) {
      match.read = req.query.read === "true";
    }

    if (req.query.sort) {
      const [field, order] = req.query.sort.split("_");
      const sortOrder = order === "desc" ? -1 : 1;
      
      if (field === "author") {
        const books = await Book.aggregate([
          { $match: match },
          { 
            $addFields: { 
              lastName: {
                $arrayElemAt: [
                  { $split: ["$author", " "] },
                  {
                    $subtract: [{ $size: { $split: ["$author", " "] } }, 1]
                  }
                ]
              }
            }
          },
          { $sort: { lastName: sortOrder } }
        ]);
        return res.json(books);
      } else {
        let sortObj = {};
        const allowedFields = ["read", "title", "genre"];
        if (allowedFields.includes(field)) {
          sortObj[field] = sortOrder;
        }
        const books = await Book.find(match).sort(sortObj);
        return res.json(books);
      }
    }

    const books = await Book.find(match);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//READ (one book)
router.get("/:id", async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);

        if (!book) return res.status(404).json({message: "Book not found."})

        res.json(book);

    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    try{
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (!updatedBook) return res.status(404).json({message: "Book not found."})

        res.json(updatedBook);

    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try{
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) return res.status(404).json({message: "Book not found."})

        res.json({message: "Book deleted"});

    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;