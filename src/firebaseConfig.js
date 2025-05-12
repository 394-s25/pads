// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7E6-8guWDGFngC20QiAJ0J9CZHHbt9Bs",
  authDomain: "pads-lake-county-good-neighbor.firebaseapp.com",
  databaseURL:
    "https://pads-lake-county-good-neighbor-default-rtdb.firebaseio.com",
  projectId: "pads-lake-county-good-neighbor",
  storageBucket: "pads-lake-county-good-neighbor.firebasestorage.app",
  messagingSenderId: "206539790840",
  appId: "1:206539790840:web:6893d8c382bc08feefde0d",
  measurementId: "G-814JTSM9JY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const database = getDatabase(app);
export { database, auth };
