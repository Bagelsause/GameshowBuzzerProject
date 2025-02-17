import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//replace with actual config values
const firebaseConfig = {
  apiKey: "AIzaSyCxrdj_LhDCC7WXnVcKNRoHCjw46fXt4j8",
  authDomain: "cottongigglegames.firebaseapp.com",
  projectId: "cottongigglegames",
  storageBucket: "cottongigglegames.firebasestorage.app",
  messagingSenderId: "908651708522",
  appId: "1:908651708522:web:5d2c67744fd5eadc08ca13",
  measurementId: "G-1RJDBWHTTB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, serverTimestamp };
