// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-9072c.firebaseapp.com",
  projectId: "mern-blog-9072c",
  storageBucket: "mern-blog-9072c.appspot.com",
  messagingSenderId: "119671856043",
  appId: "1:119671856043:web:c30294ebafed11c11950ee"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);