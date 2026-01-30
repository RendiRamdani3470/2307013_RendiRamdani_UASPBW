import { useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  // Gunakan API Key yang kamu dapatkan dari Google Cloud Console
  const API_KEY = "AIzaSyD4BqG7_XBPixxiS2iIBQHOcuXknHBxAF4"; 

  const searchBooks = async () => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Katalog Buku - UAS Rendi</h1>
      
      {/* Fitur Pencarian (Poin 3c) */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Cari judul buku..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button onClick={searchBooks} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          Cari
        </button>
      </div>

      {/* Tampilan Grid View (Poin 3b) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img 
              src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'} 
              alt={book.volumeInfo.title} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <h3 style={{ fontSize: '16px' }}>{book.volumeInfo.title}</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>{book.volumeInfo.authors?.join(', ')}</p>
            
            {/* Tombol untuk persiapan Fitur CRUD (Poin 4) */}
            <button style={{ width: '100%', marginTop: '10px' }}>Simpan Ke Favorit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;