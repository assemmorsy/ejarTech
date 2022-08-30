import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import "firebase/compat/auth"
const firebaseConfig = {

    apiKey: "AIzaSyAvE3ER10DFYq450JSVpGXG0Jbrnxvy9As",

    authDomain: "ejar-tech-112f0.firebaseapp.com",

    projectId: "ejar-tech",

    storageBucket: "ejar-tech.appspot.com",

    messagingSenderId: "485312836247",

    appId: "1:485312836247:web:61222624d190a206af2fd2"

};




firebase.initializeApp(firebaseConfig)
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectAuth, projectStorage, projectFirestore, timestamp }