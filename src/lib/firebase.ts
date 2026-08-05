import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZJjKasJHDVgC51vCt3JxKf93a4Z2jc",
  authDomain: "imersao4s.firebaseapp.com",
  projectId: "imersao4s",
  storageBucket: "imersao4s.firebasestorage.app",
  messagingSenderId: "319212331400",
  appId: "1:319212331400:web:c85c9f2aef186757e1a3d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
