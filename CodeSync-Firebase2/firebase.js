// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Replace this object with your Firebase config from Step 1
const firebaseConfig = {
  apiKey: "AIzaSyBfWAbMru9nNYxal000tZ6U6rQLfl1GjIM",
  authDomain: "codesync-97cea.firebaseapp.com",
  projectId: "codesync-97cea",
  storageBucket: "codesync-97cea.appspot.com",
  messagingSenderId: "537511550239",
  appId: "1:537511550239:web:2dfe5dd573c7778f3e3e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export so we can use Firestore in app.js
export { db, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp };
