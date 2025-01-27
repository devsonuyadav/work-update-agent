import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDQyPCaQxc9GzgPE6gizjNmrqNia8LPkHE",
  authDomain: "ehs-workreport.firebaseapp.com",
  projectId: "ehs-workreport",
  storageBucket: "ehs-workreport.firebasestorage.app",
  messagingSenderId: "872463993134",
  appId: "1:872463993134:web:78e9fd989327ad222152bf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;