import { initializeApp } from "firebase/app";
//Firebase ver9 compliant
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB0UFij6OPXgRGEGlijPhrDVwZhTPZ_HOw",
  authDomain: "image-upload-bef40.firebaseapp.com",
  databaseURL: "https://image-upload-bef40-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "image-upload-bef40",
  storageBucket: "image-upload-bef40.appspot.com",
  messagingSenderId: "643938080020",
  appId: "1:643938080020:web:d8a8ab04f698116fbd5e01"
};
/*
const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
*/

const app = initializeApp(firebaseConfig);

//Firebase ver9 compliant
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
