import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC-jC6H4MzhVFJn5OnK5LsR66baYETGb4Y",
  authDomain: "web3-social-app-c3923.firebaseapp.com",
  projectId: "web3-social-app-c3923",
  storageBucket: "web3-social-app-c3923.firebasestorage.app",
  messagingSenderId: "77487237048",
  appId: "1:77487237048:web:d0782b37acd34b3d1a514d",
  measurementId: "G-VY49ESD58R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THIS is what your other files expect:
export const db = getFirestore(app);
