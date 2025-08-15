import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

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
const firebaseConfigV2 = {
  apiKey: "AIzaSyDpi6yQBvvZyIzZB1rEzAipc-Gvx3Z0gBE",
  authDomain: "tascom-app.firebaseapp.com",
  databaseURL: "https://tascom-app-default-rtdb.firebaseio.com",
  projectId: "tascom-app",
  storageBucket: "tascom-app.firebasestorage.app",
  messagingSenderId: "844681871116",
  appId: "1:844681871116:web:0dd6dc2d67833f3d539329",
  measurementId: "G-PK3MPZ93T1"
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const appV2 = initializeApp(firebaseConfigV2, 'appV2');

const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(appV2);
const firestore = getFirestore(app);

export { db, auth, storage, firestore };
