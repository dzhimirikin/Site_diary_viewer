import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {

    apiKey:
        "AIzaSyBqefc7tIsxHXhDEp7_0mPhLIvkzlMXDHw",

    authDomain:
        "photo-diary-ff207.firebaseapp.com",

    projectId:
        "photo-diary-ff207",

    storageBucket:
        "photo-diary-ff207.firebasestorage.app",

    messagingSenderId:
        "209529923238",

    appId:
        "1:209529923238:web:06d2da69dfebc8cd15f667",

    measurementId:
        "G-Q5QQFKN575"
};

const app =
    initializeApp(
        firebaseConfig
    );

const db =
    getFirestore(
        app
    );

window.db = db;
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.serverTimestamp =
    serverTimestamp;