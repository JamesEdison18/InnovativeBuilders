import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD9ifWHXlaGFayQEqOxj1qYu9rEBaIoGwU",
    authDomain: "startupops-backend-v1.firebaseapp.com",
    projectId: "startupops-backend-v1",
    storageBucket: "startupops-backend-v1.firebasestorage.app",
    messagingSenderId: "296108987545",
    appId: "1:296108987545:web:e8e0cd0fc084de0746d408"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider };
