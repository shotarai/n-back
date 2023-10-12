import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const FirebaseApp = initializeApp({
  apiKey: "AIzaSyA92pJc4ypDO9O0WFoyXumKi1b-BqY6h6Y",
  authDomain: "nbackapp-fe81b.firebaseapp.com",
  projectId: "nbackapp-fe81b",
  storageBucket: "nbackapp-fe81b.appspot.com",
  messagingSenderId: "1031840519506",
  appId: "1:1031840519506:web:2755f6eee68c47776e568b",
});

export const storage = getStorage(FirebaseApp);
export const auth = getAuth(FirebaseApp);
export const db = getFirestore(FirebaseApp);