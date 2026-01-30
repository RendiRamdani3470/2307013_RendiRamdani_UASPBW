import { useState, useEffect } from 'react';
import { auth } from './firebase'; // Import auth dari firebase.js yang kita buat tadi
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from './components/Login';
// ... import axios dan lainnya tetap sama

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Mengecek status login user secara otomatis
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>Halo, {user.email}</p>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
      {/* Kode pencarian buku kamu yang sebelumnya taruh di sini */}
    </div>
  );
}