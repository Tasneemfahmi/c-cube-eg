// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEOZg9yIUomHqeoh5w6QRA0lyvFQev7_s",
  authDomain: "c-cube-eg.firebaseapp.com",
  databaseURL: "https://c-cube-eg-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "c-cube-eg",
  storageBucket: "c-cube-eg.firebasestorage.app",
  messagingSenderId: "386897939069",
  appId: "1:386897939069:web:80d4f3bdd82b69e395ff14",
  measurementId: "G-7C3WZ5X12M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Initialize auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Configure Facebook provider
facebookProvider.addScope('email');

export { app, db, analytics, auth, googleProvider, facebookProvider };