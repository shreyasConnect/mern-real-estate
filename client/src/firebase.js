// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "estate-buss.firebaseapp.com",
    projectId: "estate-buss",
    storageBucket: "estate-buss.appspot.com",
    messagingSenderId: "887087587806",
    appId: "1:887087587806:web:d18c457be0ece2575b7d4f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);