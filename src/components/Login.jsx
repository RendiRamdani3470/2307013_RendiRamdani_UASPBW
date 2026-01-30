import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Akun berhasil dibuat! Silakan masuk.");
        setIsRegister(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert("Email atau Password salah!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={glassCardStyle}>
        <h1 style={logoStyle}>READROOM</h1>
        <p style={subtitleStyle}>{isRegister ? "Daftar untuk mulai membaca" : "Sistem Informasi Perpustakaan"}</p>
        
        <form onSubmit={handleAuth} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Email Mahasiswa</label>
            <input
              type="email"
              placeholder="nama@itg.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" style={buttonStyle}>
            {isRegister ? "Daftar Akun" : "Masuk Sekarang"}
          </button>
        </form>

        <p style={footerTextStyle}>
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} style={toggleStyle}>
            {isRegister ? "Login di sini" : "Daftar sekarang"}
          </span>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // Background menggunakan gambar perpustakaan gelap yang estetik
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const glassCardStyle = {
  background: "rgba(20, 20, 20, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "50px 40px",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
};

const logoStyle = {
  color: "#E50914",
  fontSize: "2.5rem",
  fontWeight: "900",
  letterSpacing: "2px",
  margin: "0 0 5px 0",
};

const subtitleStyle = {
  color: "#ccc",
  fontSize: "14px",
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroup = {
  textAlign: "left",
};

const labelStyle = {
  display: "block",
  color: "#eee",
  fontSize: "12px",
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#0a0a0a",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  background: "#E50914",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
  transition: "0.3s ease",
};

const footerTextStyle = {
  color: "#888",
  marginTop: "25px",
  fontSize: "14px",
};

const toggleStyle = {
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "underline",
};

export default Login;