import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';

import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyBXd3c4AzYwTfhhgNFy11kSoP1bnDWtrO0",
    authDomain: "metal-summer-239200.firebaseapp.com",
    databaseURL: "https://metal-summer-239200.firebaseio.com",
    projectId: "metal-summer-239200",
    storageBucket: "metal-summer-239200.appspot.com",
    messagingSenderId: "432515219546",
    appId: "1:432515219546:web:375f1f7609446f9df19863",
    measurementId: "G-5XY4J5XBBP"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const blePeripheral = (window as any).blePeripheral

var SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
var TX_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
var RX_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

if (blePeripheral) {
    console.log("blePeripheral: available")
    Promise.all([
        blePeripheral.createService(SERVICE_UUID),
        blePeripheral.addCharacteristic(SERVICE_UUID, TX_UUID, blePeripheral.properties.WRITE, blePeripheral.permissions.WRITEABLE),
        blePeripheral.addCharacteristic(SERVICE_UUID, RX_UUID, blePeripheral.properties.READ | blePeripheral.properties.NOTIFY, blePeripheral.permissions.READABLE),
        blePeripheral.publishService(SERVICE_UUID),
        blePeripheral.startAdvertising(SERVICE_UUID, 'UART')
    ]).then(
        function() { console.log ('Created UART Service'); },
        function() { console.error('Fucking BLE') }
    );
}