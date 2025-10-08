// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3yZNCqorBBfX9cfBWRZEeN9fDmzWCQmg",
  authDomain: "whatsapp-234b0.firebaseapp.com",
  projectId: "whatsapp-234b0",
  storageBucket: "whatsapp-234b0.firebasestorage.app",
  messagingSenderId: "823246566881",
  appId: "1:823246566881:web:d1abe4669f2c40e3c34ea0",
  measurementId: "G-HK8FXKCE3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);