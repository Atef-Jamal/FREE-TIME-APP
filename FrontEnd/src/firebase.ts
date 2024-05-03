import { initializeApp } from "@firebase/app";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3FHxLS1PXYqEceVHzq65gANMMYLx6a5Q",
  authDomain: "free-time-7196b.firebaseapp.com",
  projectId: "free-time-7196b",
  storageBucket: "free-time-7196b.appspot.com",
  messagingSenderId: "854806561837",
  appId: "1:854806561837:web:39f7b9a99babceed7424a4",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
