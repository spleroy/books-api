import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { createBook } from '../../services/api';

const AddBook = ({ onBookAdded, disabled, onCancel }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [read, setRead] = useState(false);

  const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 'Biography'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBook = { title, author, genre, read };
    try {
      const res = await createBook(newBook);
      onBookAdded(res.data);
      setTitle('');
      setAuthor('');
      setGenre('');
      setRead(false);
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };

  return (
    <Card className="mb-3 shadow-sm" style={{ position: 'relative' }}>
      <Card.Body>
        {onCancel && (
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
            aria-label="Cancel add"
          >
            &times;
          </Button>
        )}

        <h4 className="card-title">Add New Book</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={disabled}
            />
          </Form.Group>

          <Form.Group controlId="formAuthor" className="mb-3">
            <Form.Label>Author:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={disabled}
            />
          </Form.Group>

          <Form.Group controlId="formGenre" className="mb-3">
            <Form.Label>Genre:</Form.Label>
            <Form.Select 
              value={genre} 
              onChange={(e) => setGenre(e.target.value)} 
              required
              disabled={disabled}
            >
              <option value="">Select genre:</option>
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
              disabled={disabled}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={disabled}>
            Add Book
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddBook;
