// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB-1lY6fOWVUXrw5QHReLuqKBLpI3I082M",
  authDomain: "skillbridge-1984.firebaseapp.com",
  projectId: "skillbridge-1984",
  storageBucket: "skillbridge-1984.firebasestorage.app",
  messagingSenderId: "933649504607",
  appId: "1:933649504607:web:727e194bec2c8bc5f33eea",
  measurementId: "G-ZJ5519KYHQ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);