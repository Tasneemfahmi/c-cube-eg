import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch products
const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};
