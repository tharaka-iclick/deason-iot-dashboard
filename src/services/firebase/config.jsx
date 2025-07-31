import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCGSfpPcf2CXicGSV-Rhrh565xZKq05sA",
  authDomain: "test-scopious.firebaseapp.com",
  databaseURL: "https://test-scopious-default-rtdb.firebaseio.com",
  projectId: "test-scopious",
  storageBucket: "test-scopious.appspot.com",
  messagingSenderId: "356950590687",
  appId: "1:356950590687:web:82ebc8c776ff557d5c956a",
  measurementId: "G-D4QDN1LQJE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
