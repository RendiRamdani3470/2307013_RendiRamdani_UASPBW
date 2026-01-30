import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Tambahkan ini untuk Login
import { getFirestore } from "firebase/firestore"; // Tambahkan ini untuk Simpan Buku

const firebaseConfig = {
  apiKey: "AIzaSyArhG8ByeN-h1HVBUdFXV2E2dsMtPlfI8U",
  authDomain: "uas-pbw-rendiramdani.firebaseapp.com",
  projectId: "uas-pbw-rendiramdani",
  storageBucket: "uas-pbw-rendiramdani.firebasestorage.app",
  messagingSenderId: "723998814879",
  appId: "1:723998814879:web:ade49c3a11fab5c7fd68aa",
  measurementId: "G-1ZNGTZ3B29"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Ekspor untuk fitur Login
export const db = getFirestore(app); // Ekspor untuk fitur Simpan Favorit