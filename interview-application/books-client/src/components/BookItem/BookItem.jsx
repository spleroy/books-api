import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import './BookItem.css'; 

const BookItem = ({ book, onDelete, onEdit }) => {
  return (
    <Card className="mb-3 shadow-sm book-card" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
      <Card.Body>
        <Card.Title>
          {book.title}{" "}
          {book.read && <Badge bg="success" >Read ✓</Badge>}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">by {book.author}</Card.Subtitle>
        {book.genre && <Card.Text>Genre: {book.genre}</Card.Text>}
        <Button variant="outline-secondary" size="sm" onClick={() => onEdit(book)} className="me-2">
          Edit
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(book._id)}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookItem;
