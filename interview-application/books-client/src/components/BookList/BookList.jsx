import React from 'react';
import BookItem from '../BookItem/BookItem';

const BookList = ({ books, onDelete, onEdit }) => {
  return (
    <div>
      {books.map(book => (
        <BookItem 
          key={book._id} 
          book={book} 
          onDelete={onDelete} 
          onEdit={onEdit} 
        />
      ))}
    </div>
  );
};

export default BookList;
