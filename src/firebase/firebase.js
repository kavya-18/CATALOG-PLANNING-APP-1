// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// YOUR FIREBASE CONFIG — keep what Firebase gave you
const firebaseConfig = {
  apiKey: "AIzaSyQwBwXn53uZYfhHW9nQiv-gEDLlHNx0",
  authDomain: "wedding-app-648b3.firebaseapp.com",
  projectId: "wedding-app-648b3",
  storageBucket: "wedding-app-648b3.appspot.com",
  messagingSenderId: "1447371536326",
  appId: "1:1447371536326:web:821603c6cbde47655ef4c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
