import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { getBooks, deleteBook } from './services/api';
import AddBook from './components/AddBook/AddBook';
import EditBook from './components/EditBook/EditBook';
import BookList from './components/BookList/BookList';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [readFilter, setReadFilter] = useState("");
  const [showJumpButton, setShowJumpButton] = useState(false); 
  const [addingBook, setAddingBook] = useState(false);

  const editFormRef = useRef(null);

  const fetchBooks = useCallback(async () => {
    try {
      const params = {};
      if (search) {
        params.search = search;
      }
      if (sort) {
        params.sort = sort;  
      }
      if (readFilter) {
        params.read = readFilter;  
      }

      const res = await getBooks(params);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [search, sort, readFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (editingBook && editFormRef.current) {
      editFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editingBook]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {  
        setShowJumpButton(true);
      } else {
        setShowJumpButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!editingBook) return;
    
    const handleClickOutside = (event) => {
      if (editFormRef.current && !editFormRef.current.contains(event.target)) {
        setEditingBook(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingBook]);

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook]);
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks(books.map(book => book._id === updatedBook._id ? updatedBook : book));
    setEditingBook(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container fluid>
      <header className="app-header position-relative">
        <div className="header-content">
          <h1 className="my-4">Books Management App</h1>
          <small
            className="add-book-link"
            onClick={() => setAddingBook(true)}
          >
            Add book
          </small>
        </div>
      </header>

      <Row className="mb-3" style={{ marginTop: '0.5rem' }}>
        <Col md={6}>
          {addingBook && (
            <AddBook 
              onBookAdded={(newBook) => {
                handleBookAdded(newBook);
              }} 
              disabled={!!editingBook}
              onCancel={() => setAddingBook(false)}
            />
          )}
        </Col>
        <Col md={6}>
          {editingBook && (
            <div ref={editFormRef}>
              <EditBook 
                book={editingBook} 
                onBookUpdated={handleBookUpdated}
                onCancel={() => setEditingBook(null)}
              />
            </div>
          )}
        </Col>
      </Row>

      <Row className="align-items-center mb-3">
        <Col md={4}>
          <h2 className="card-title align-with-header">All Books</h2>
        </Col>
        <Col md={8}>
          <Form onSubmit={handleSearchSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="search">
                  <Form.Label className="slightly-bold">Search (Author or Title)</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="sort">
                  <Form.Label className="slightly-bold">Sort By</Form.Label>
                  <Form.Control 
                    as="select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">-- Select an Option --</option>
                    <option value="author_asc">Author (A to Z)</option>
                    <option value="author_desc">Author (Z to A)</option>
                    <option value="title_asc">Title (A to Z)</option>
                    <option value="title_desc">Title (Z to A)</option>
                    <option value="genre_asc">Genre (A to Z)</option>
                    <option value="genre_desc">Genre (Z to A)</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="filterRead">
                  <Form.Label className="slightly-bold">Read Status</Form.Label>
                  <Form.Control 
                    as="select"
                    value={readFilter}
                    onChange={(e) => setReadFilter(e.target.value)}
                  >
                    <option value="">-- No Filter --</option>
                    <option value="true">Read</option>
                    <option value="false">Not Read</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                <Button variant="primary" type="submit">
                  Go
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <BookList 
            books={books} 
            onDelete={handleDelete} 
            onEdit={setEditingBook} 
          />
        </Col>
      </Row>

      {showJumpButton && (
        <Button 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            borderRadius: '50%',
            padding: '10px 15px',
          }}
          variant="secondary"
        >
          ↑ Top
        </Button>
      )}
    </Container>
  );
}

export default App;
