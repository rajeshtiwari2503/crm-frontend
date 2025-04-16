 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzTa51dr3HI87PgWoEkG6BCjZxpmaKFMo",
  authDomain: "servsysms.firebaseapp.com",
  projectId: "servsysms",
  storageBucket: "servsysms.firebasestorage.app",
  messagingSenderId: "350738282052",
  appId: "1:350738282052:web:514443e2758b4f60c12e11"
};

// Initialize Firebase
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };