import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [readLater, setReadLater] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("beranda");
  const [loading, setLoading] = useState(false);
  
  const API_KEY = "AIzaSyD4BqG7_XBPixxiS2iIBQHOcuXknHBxAF4"; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const qFav = query(collection(db, "favorites"), where("userId", "==", user.uid));
      const unsubFav = onSnapshot(qFav, (snap) => {
        setFavorites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      const qLater = query(collection(db, "readLater"), where("userId", "==", user.uid));
      const unsubLater = onSnapshot(qLater, (snap) => {
        setReadLater(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return () => { unsubFav(); unsubLater(); };
    }
  }, [user]);

  useEffect(() => {
    if (user && books.length === 0) fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=12&key=${API_KEY}`);
      setBooks(res.data.items || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const searchBooks = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery.trim()}&maxResults=20&key=${API_KEY}`);
      setBooks(res.data.items || []);
      setView("beranda");
    } catch (e) { alert("Gagal mencari!"); }
    setLoading(false);
  };

  const saveToDb = async (collectionName, book) => {
    try {
      await addDoc(collection(db, collectionName), {
        userId: user.uid,
        title: book.volumeInfo?.title || book.title,
        thumbnail: book.volumeInfo?.imageLinks?.thumbnail || book.thumbnail || "",
        // Simpan link baca ke database juga
        previewLink: book.volumeInfo?.previewLink || book.previewLink || "#"
      });
      alert(`Berhasil ditambah ke ${collectionName === 'favorites' ? 'Favorit' : 'Baca Nanti'}!`);
    } catch (e) { alert("Gagal menyimpan!"); }
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Arial', margin: 0 }}>
      
      {/* SIDEBAR */}
      <nav style={{ width: '260px', minWidth: '260px', background: '#000', padding: '40px 20px', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <h1 style={{ color: '#E50914', fontSize: '2rem', fontWeight: '900', textAlign: 'center', marginBottom: '40px' }}>READROOM</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setView("beranda")} style={navStyle(view === "beranda")}>🏠 Discover</button>
          <button onClick={() => setView("favorit")} style={navStyle(view === "favorit")}>💖 Favorit ({favorites.length})</button>
          <button onClick={() => setView("nanti")} style={navStyle(view === "nanti")}>🔖 Baca Nanti ({readLater.length})</button>
        </div>

        <div style={{ marginTop: 'auto', padding: '15px', background: '#141414', borderRadius: '10px', border: '1px solid #333' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#E50914' }}>{user.email}</p>
            <button onClick={() => signOut(auth)} style={{ width: '100%', marginTop: '10px', padding: '8px', background: 'transparent', color: '#fff', border: '1px solid #444', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      {/* MAIN AREA */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '40px' }}>
          <div style={{ display: 'flex', gap: '10px', maxWidth: '600px', marginBottom: '40px' }}>
            <input type="text" placeholder="Cari buku..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #444', background: '#141414', color: '#fff', outline: 'none' }} />
            <button onClick={searchBooks} style={{ padding: '12px 30px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Cari</button>
          </div>

          <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
            {view === "beranda" ? "Rekomendasi" : view === "favorit" ? "Koleksi Favorit" : "Daftar Baca Nanti"}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' }}>
            {(view === "beranda" ? books : view === "favorit" ? favorites : readLater).map((item) => {
              const b = item.volumeInfo || item;
              // Ambil link baca dari API atau database
              const linkBaca = b.previewLink || "#";

              return (
                <div key={item.id} style={{ background: '#141414', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222' }}>
                  <img src={b.imageLinks?.thumbnail || b.thumbnail || 'https://via.placeholder.com/128x192'} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {/* --- TOMBOL BACA --- */}
                      <button 
                        onClick={() => window.open(linkBaca, "_blank")} 
                        style={btnAction('#2ecc71')}
                      >
                        📖 Baca Sekarang
                      </button>

                      {view === "beranda" ? (
                        <>
                          <button onClick={() => saveToDb('favorites', item)} style={btnAction('#E50914')}>💖 Favorit</button>
                          <button onClick={() => saveToDb('readLater', item)} style={btnAction('#444')}>🔖 Baca Nanti</button>
                        </>
                      ) : (
                        <button onClick={() => deleteDoc(doc(db, view === "favorit" ? "favorites" : "readLater", item.id))} style={btnAction('transparent', '1px solid #E50914')}>Hapus</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

const navStyle = (active) => ({
  padding: '15px', textAlign: 'left', background: active ? '#E50914' : 'transparent', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
});

const btnAction = (bg, border = 'none') => ({
  width: '100%', padding: '8px', background: bg, color: '#fff', border: border, borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
});

export default App;