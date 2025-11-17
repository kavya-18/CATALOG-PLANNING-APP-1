// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWy8UwK3nSuZYfvhHd9WnQiv-gEDLHNx0",
  authDomain: "wedding-app-648b3.firebaseapp.com",
  projectId: "wedding-app-648b3",
  storageBucket: "wedding-app-648b3.firebasestorage.app",
  messagingSenderId: "447371536326",
  appId: "1:447371536326:web:821603c6cbde47655ef4c7"
};

//  Initialize Firebase App — REQUIRED
const app = initializeApp(firebaseConfig);

// Export Firestore + Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
