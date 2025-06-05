// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 Import Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-eUwBe3iLRoxQKr7_hmG5Sciq054DDS0",
  authDomain: "kwiva-5090.firebaseapp.com",
  projectId: "kwiva-5090",
  storageBucket: "kwiva-5090.appspot.com", // ✅ Fix: should be *.appspot.com
  messagingSenderId: "38541255164",
  appId: "1:38541255164:web:76165e1c9c2308210a9279"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Storage
const storage = getStorage(app); // 👈 Initialize Storage

export { db, storage };

