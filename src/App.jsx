import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const API_KEY = "AIzaSyArhG8ByeN-h1HVBUdFXV2E2dsMtPlfI8U"; // API Key dari gambar kamu

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Cari Buku (Poin 3)
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

  // Fungsi Simpan Favorit (Poin 4 - CRUD)
  const saveToFavorite = async (book) => {
    try {
      await addDoc(collection(db, "favorites"), {
        userId: user.uid,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || ["Unknown"],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || ""
      });
      alert("Buku berhasil disimpan ke favorit!");
    } catch (error) {
      alert("Gagal menyimpan: " + error.message);
    }
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* Header & Logout (Poin 2) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '8px' }}>
        <p><strong>User:</strong> {user.email}</p>
        <button onClick={() => signOut(auth)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      <h1>Katalog Buku Digital - UAS</h1>
      
      {/* Search Bar (Poin 3c) */}
      <div style={{ margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="Cari judul buku..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={searchBooks} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Cari</button>
      </div>

      {/* Grid View (Poin 3b) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <img 
              src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'} 
              alt={book.volumeInfo.title} 
              style={{ width: '120px', height: '180px', objectFit: 'cover' }}
            />
            <h3 style={{ fontSize: '14px', margin: '10px 0' }}>{book.volumeInfo.title}</h3>
            <button 
              onClick={() => saveToFavorite(book)}
              style={{ width: '100%', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ❤️ Simpan Favorit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;