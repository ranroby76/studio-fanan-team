// src/lib/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY3NSTAVvB7o5CHTrPKEgqqiVLUgq59xw",
  authDomain: "bizzmaster-pro-3.firebaseapp.com",
  databaseURL: "https://bizzmaster-pro-3-default-rtdb.firebaseio.com",
  projectId: "bizzmaster-pro-3",
  storageBucket: "bizzmaster-pro-3.firebasestorage.app",
  messagingSenderId: "86626138547",
  appId: "1:86626138547:web:0764e38fb6daa00b8073c6"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const storage: FirebaseStorage = getStorage(app);

export { app, storage };
