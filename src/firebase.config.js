// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC62QKwdLGJ1P0QNwTxSWIvIadfN_iBZYI',
  authDomain: 'realestate-agent-app.firebaseapp.com',
  projectId: 'realestate-agent-app',
  storageBucket: 'realestate-agent-app.appspot.com',
  messagingSenderId: '166176185425',
  appId: '1:166176185425:web:ebccbb83e690072d06ec70',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
