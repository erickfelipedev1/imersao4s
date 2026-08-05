import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZJjKasJHDVgC51vCt3JxKf93a4Z2jc",
  authDomain: "imersao4s.firebaseapp.com",
  projectId: "imersao4s",
  storageBucket: "imersao4s.firebasestorage.app",
  messagingSenderId: "319212331400",
  appId: "1:319212331400:web:c85c9f2aef186757e1a3d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
