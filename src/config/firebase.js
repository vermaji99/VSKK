import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyCIqlpOaDtkjxyzX9V1EHP34_1R6qVPDYU",
  authDomain: "vskk-5e02f.firebaseapp.com",
  projectId: "vskk-5e02f",
  storageBucket: "vskk-5e02f.firebasestorage.app",
  messagingSenderId: "414485648619",
  appId: "1:414485648619:web:b4c28b6e31f998a405daae",
  measurementId: "G-T3TQTB3023"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
