import firebase from 'firebase/app'
import 'firebase/firestore'


//Kontrollere forbindelsen til FIREBASE

const config = {
    apiKey: "AIzaSyCTlSBsY-34oYYkop3JpWeydTn-HpO0Dnk",
    authDomain: "wishlist-91545.firebaseapp.com",
    databaseURL: "https://wishlist-91545.firebaseio.com",
    projectId: "wishlist-91545",
    storageBucket: "wishlist-91545.appspot.com",
    messagingSenderId: "897418896567",
    appId: "1:897418896567:web:a0270c4548bab8ece31932"
}


firebase.initializeApp(config)


// SÆTTER genveje til DB og forkorter.

const db = firebase.firestore()

const boardsRef = db.collection('boards')
const listsRef = db.collection('lists')
const cardsRef = db.collection('cards')


export {boardsRef, listsRef, cardsRef}