import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "revents-app-e67ba.firebaseapp.com",
  databaseURL: "https://revents-app-e67ba.firebaseio.com",
  projectId: "revents-app-e67ba",
  storageBucket: "revents-app-e67ba.appspot.com",
  messagingSenderId: "444800729294",
  appId: "1:444800729294:web:9f84fb1f27cb151ecf509f",
  measurementId: "G-CJPFZW59VH",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
