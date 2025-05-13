// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdanyQbj_mEq6PzOSZPMCLnir1bgCZzJE",
  authDomain: "ai-interview-app-9db16.firebaseapp.com",
  projectId: "ai-interview-app-9db16",
  storageBucket: "ai-interview-app-9db16.firebasestorage.app",
  messagingSenderId: "377560752280",
  appId: "1:377560752280:web:ee9f045152dbcf6be330ed",
  measurementId: "G-4P9GWVQMZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const analytics = getAnalytics(app);