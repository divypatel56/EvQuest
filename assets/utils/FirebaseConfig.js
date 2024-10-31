// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDstd5X4Yc5vugS0OcH_3r9hrCYAR0IJJg",
    authDomain: "ev-quest.firebaseapp.com",
    projectId: "ev-quest",
    storageBucket: "ev-quest.appspot.com",
    messagingSenderId: "765954200588",
    appId: "1:765954200588:web:eb0d8d2cb77290e115ca29",
    measurementId: "G-N0N9WYQHY6"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
