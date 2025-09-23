// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5ElbHmZls8M8EX3HTZP4h40mIoSrUQNE",
  authDomain: "civic-issue-system-12b96.firebaseapp.com",
  projectId: "civic-issue-system-12b96",
  storageBucket: "civic-issue-system-12b96.firebasestorage.app",
  messagingSenderId: "624803759192",
  appId: "1:624803759192:web:04fd09822f02aa56e9762d",
  measurementId: "G-S0JQR3XP07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
