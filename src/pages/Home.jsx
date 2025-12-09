import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setWallet(localStorage.getItem("wallet"));
    loadUsers();
  }, []);

  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(doc => doc.data()));
  }

  async function sendRequest(to) {
    await addDoc(collection(db, "friendRequests"), {
      from: wallet,
      to,
      status: "pending"
    });
    alert("Friend request sent!");
  }

  return (
    <div className="page">
      <h1>All Users</h1>

      {users.map(u => (
        <div key={u.wallet} className="card">
          <p>{u.wallet} {u.wallet === wallet && "(You)"}</p>

          {u.wallet !== wallet && (
            <button className="btn" onClick={() => sendRequest(u.wallet)}>
              Send Friend Request
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
