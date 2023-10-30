import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const FirebaseApp = initializeApp(firebaseConfig);
initializeAuth(FirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const storage = getStorage(FirebaseApp);
export const auth = getAuth(FirebaseApp);
export const db = getFirestore(FirebaseApp);