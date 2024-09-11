// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-40331.firebaseapp.com",
  projectId: "mern-blog-40331",
  storageBucket: "mern-blog-40331.appspot.com",
  messagingSenderId: "128176658754",
  appId: "1:128176658754:web:17cae847deff860cc990db"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);