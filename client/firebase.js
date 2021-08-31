import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDHQDlXAYxlpS7JLkXGsJ6cKLRr4ncNfwE",
    authDomain: "web-chat-portfolio.firebaseapp.com",
    projectId: "web-chat-portfolio",
    storageBucket: "web-chat-portfolio.appspot.com",
    messagingSenderId: "898667502862",
    appId: "1:898667502862:web:61553ad5dd5cfc09d1cb5f",
    measurementId: "G-PTT2D6FX75"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };