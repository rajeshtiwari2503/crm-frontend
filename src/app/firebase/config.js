 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYfib0PPm2jhAfMePzceN5yKv8p2vS97A",
  authDomain: "servsy-f26f5.firebaseapp.com",
  projectId: "servsy-f26f5",
  storageBucket: "servsy-f26f5.firebasestorage.app",
  messagingSenderId: "824248435029",
  appId: "1:824248435029:web:7fcc7c81748d050300efdc",
  measurementId: "G-EN5H951CB1"
};

// Initialize Firebase
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };