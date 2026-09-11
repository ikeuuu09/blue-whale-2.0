// firebase-config.js

const firebaseConfig = {
    apiKey: "AIzaSyDFQkuNkcDS7jyUxkzMgw280po-e_6OEVw",
    authDomain: "blue-whale-1db60.firebaseapp.com",
    projectId: "blue-whale-1db60",
    storageBucket:"blue-whale-1db60.firebasestorage.app",
    messagingSenderId: "809983247015",
    appId: "1:809983247015:web:eb808a5853214ab7011182",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

console.log("Firebase initialized successfully");
console.log("Firebase app:", firebase.app().name);
console.log("Firestore:", db);
console.log("Auth:", auth);