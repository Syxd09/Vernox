import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwtFYfgYzDr9zxZxjQCkzhbI_2Dxmnle8",
  authDomain: "vernox-1b5d5.firebaseapp.com",
  projectId: "vernox-1b5d5",
  storageBucket: "vernox-1b5d5.firebasestorage.app",
  messagingSenderId: "595354584631",
  appId: "1:595354584631:web:8c845d5c5bc3568437e1b2",
  measurementId: "G-RH25QZ3N16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
