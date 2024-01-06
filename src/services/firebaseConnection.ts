// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxuDliylA_ydpQrkK1n4Ds8SbIccanb3I",
  authDomain: "webcarros-5d619.firebaseapp.com",
  projectId: "webcarros-5d619",
  storageBucket: "webcarros-5d619.appspot.com",
  messagingSenderId: "922361284853",
  appId: "1:922361284853:web:97a7bfe05f188de6baddbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage}