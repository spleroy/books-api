import axios from 'axios';

const API_URL = 'http://localhost:3750/api/books';

export const getBooks = (params = {}) => axios.get(API_URL, { params });
export const createBook = (bookData) => axios.post(API_URL, bookData);
export const updateBook = (id, updatedData) => axios.put(`${API_URL}/${id}`, updatedData);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);