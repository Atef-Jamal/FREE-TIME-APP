import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSk9IdSO7KuxKxAp6Ypfe1hv29Ms0y3cc",
  authDomain: "free-money-7aec1.firebaseapp.com",
  projectId: "free-money-7aec1",
  storageBucket: "free-money-7aec1.appspot.com",
  messagingSenderId: "611063828335",
  appId: "1:611063828335:web:b19c610305ad207724629a",
  measurementId: "G-BDEVGTQ41V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
