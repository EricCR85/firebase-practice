// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries!

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXtT6y2W_D1OqaFyWDUThX1vYwTcR09K0",
  authDomain: "fir-practice-dd97b.firebaseapp.com",
  projectId: "fir-practice-dd97b",
  storageBucket: "fir-practice-dd97b.firebasestorage.app",
  messagingSenderId: "955685207409",
  appId: "1:955685207409:web:3a6e63bf7a2659a110cad0"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const auth = getAuth();