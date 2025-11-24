// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyQwBwXn53uZYfhHW9nQiv-gEDLlHNx0",
  authDomain: "wedding-app-648b3.firebaseapp.com",
  projectId: "wedding-app-648b3",

  // ✅ FIX: use the correct bucket
  storageBucket: "wedding-app-648b3.firebasestorage.app",

  messagingSenderId: "1447371536326",
  appId: "1:1447371536326:web:821603c6cbde47655ef4c7",
};

const app = initializeApp(firebaseConfig);

// Firestore stays the same
export const db = getFirestore(app);

// IMPORTANT FIX: use the new bucket explicitly
export const storage = getStorage(app, "gs://wedding-app-648b3.firebasestorage.app");
