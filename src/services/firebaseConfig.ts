import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
 apiKey: "AIzaSyBW1HXPY75R_dK8fJjyENEsuh77Tl-V9jg",
  authDomain: "parcialfinal-12711.firebaseapp.com",
  projectId: "parcialfinal-12711",
  storageBucket: "parcialfinal-12711.firebasestorage.app",
  messagingSenderId: "566695385945",
  appId: "1:566695385945:web:6033ecb685686fc9ff0a48",
  measurementId: "G-4S8WYGB028"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);