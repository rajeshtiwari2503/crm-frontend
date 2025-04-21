 // firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzTa51dr3HI87PgWoEkG6BCjZxpmaKFMo",
  authDomain: "servsysms.firebaseapp.com",
  projectId: "servsysms",
  storageBucket: "servsysms.appspot.com",
  messagingSenderId: "350738282052",
  appId: "1:350738282052:web:514443e2758b4f60c12e11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
