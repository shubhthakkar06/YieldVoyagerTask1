import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
