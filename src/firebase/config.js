// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArOj91r4ymvJF4YOzw6CVM0LEdvv0zkeM",
  authDomain: "supply-mitra.firebaseapp.com",
  projectId: "supply-mitra",
  storageBucket: "supply-mitra.firebasestorage.app",
  messagingSenderId: "815567534069",
  appId: "1:815567534069:web:f69ad4afc6749c9c7e52bc",
  measurementId: "G-T86LWJMCTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);