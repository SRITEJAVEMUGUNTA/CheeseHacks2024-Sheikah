// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "api-key",
  authDomain: "cheesehacks-8f6ea.firebaseapp.com",
  projectId: "cheesehacks-8f6ea",
  storageBucket: "cheesehacks-8f6ea.firebasestorage.app",
  messagingSenderId: "199044906627",
  appId: "1:199044906627:web:875cab37ad2809298565b6",
  measurementId: "G-SRK0F2DGG5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export function createUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function attemptSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export default auth;
