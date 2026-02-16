import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase config - safe to expose (security handled by database rules)
// Replace these values with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCo645DfX34dmU-tUea0x3N1JBTw_nsWfo",
    authDomain: "hatsellrules.firebaseapp.com",
    databaseURL: "https://hatsellrules-default-rtdb.firebaseio.com",
    projectId: "hatsellrules",
    storageBucket: "hatsellrules.firebasestorage.app",
    messagingSenderId: "878668426350",
    appId: "1:878668426350:web:61f65841007a03d913ca7f"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
