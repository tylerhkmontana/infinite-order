// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp7GEk21lkVw9mzvdc587rX1UGTsr2wLI",
  authDomain: "infinite-order.firebaseapp.com",
  projectId: "infinite-order",
  storageBucket: "infinite-order.appspot.com",
  messagingSenderId: "445874492320",
  appId: "1:445874492320:web:c76a377c67af80ba570ac5",
  measurementId: "G-C9Q4Q2TF7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app)

export {
    app,
    auth
}