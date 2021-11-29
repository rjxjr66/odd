import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/firestore';

// var firebaseConfig = {
//     apiKey: "AIzaSyBXd3c4AzYwTfhhgNFy11kSoP1bnDWtrO0",
//     authDomain: "metal-summer-239200.firebaseapp.com",
//     databaseURL: "https://metal-summer-239200.firebaseio.com",
//     projectId: "metal-summer-239200",
//     storageBucket: "metal-summer-239200.appspot.com",
//     messagingSenderId: "432515219546",
//     appId: "1:432515219546:web:375f1f7609446f9df19863",
//     measurementId: "G-5XY4J5XBBP"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAHFcWVRXLAWbr_hf7T525BUuqsM7yWtOU",
  authDomain: "odd-application.firebaseapp.com",
  projectId: "odd-application",
  storageBucket: "odd-application.appspot.com",
  messagingSenderId: "246736078679",
  appId: "1:246736078679:web:a85e0f62bc5694ce152012",
  measurementId: "G-F8H1JZYB8J"
};


firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();