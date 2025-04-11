import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap'; 
import { updateBook } from '../../services/api';

const EditBook = ({ book, onBookUpdated, onCancel }) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre || '');
  const [read, setRead] = useState(book.read || false);

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBook = { title, author, genre, read };
    try {
      const res = await updateBook(book._id, updatedBook);
      onBookUpdated(res.data);
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  return (
    <Card className="mb-3 shadow-sm" style={{ position: 'relative' }}>
      <Card.Body>
        <Button 
          variant="light" 
          onClick={onCancel} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            fontSize: '1.2rem',
            lineHeight: '1'
          }}
          aria-label="Cancel edit"
        >
          &times;
        </Button>
        
        <h4 className="card-title">Update Book</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAuthor" className="mb-3">
            <Form.Label>Author:</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formGenre" className="mb-3">
            <Form.Label>Genre:</Form.Label>
            <Form.Select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option value="">Select genre</option>
              {genres.map((g, index) => (
                <option key={index} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formRead" className="mb-3">
            <Form.Check 
              type="checkbox"
              label="Already read?"
              checked={read}
              onChange={(e) => setRead(e.target.checked)}
            />
          </Form.Group>

          <Button variant="secondary" type="submit">
            Update Book
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditBook;
