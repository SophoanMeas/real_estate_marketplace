// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-sophoan-state.firebaseapp.com",
  projectId: "mern-sophoan-state",
  storageBucket: "mern-sophoan-state.appspot.com",
  messagingSenderId: "73487159371",
  appId: "1:73487159371:web:e97968c6859c86fff8fdce"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);