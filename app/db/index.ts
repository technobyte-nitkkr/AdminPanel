import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import fireapp from "@/app/firebase.config";

// Get Firestore instance
const db = getFirestore(fireapp);
export const auth = getAuth(fireapp);
export { db };
