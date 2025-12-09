import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Requests() {
  const [wallet, setWallet] = useState("");
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  useEffect(() => {
    const w = localStorage.getItem("wallet");
    setWallet(w);
    loadRequests(w);
  }, []);

  async function loadRequests(currentWallet) {
    const snap = await getDocs(collection(db, "friendRequests"));
    const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const incomingReqs = reqs.filter(
      r => r.to.toLowerCase() === currentWallet.toLowerCase()
    );

    const outgoingReqs = reqs.filter(
      r => r.from.toLowerCase() === currentWallet.toLowerCase()
    );

    setIncoming(incomingReqs);
    setOutgoing(outgoingReqs);
  }

  async function accept(req) {
    const userA = doc(db, "users", req.from);
    const userB = doc(db, "users", req.to);

    await updateDoc(userA, { friends: [req.to] });
    await updateDoc(userB, { friends: [req.from] });

    await deleteDoc(doc(db, "friendRequests", req.id));
    loadRequests(wallet);
  }

  async function reject(id) {
    await deleteDoc(doc(db, "friendRequests", id));
    loadRequests(wallet);
  }

  return (
    <div className="requests-page">
      <h1>Friend Requests</h1>

      <h2>Incoming</h2>
      {incoming.length === 0 && (
        <p className="empty-text">No incoming requests.</p>
      )}
      {incoming.map(req => (
        <div key={req.id} className="request-card">
          <p>From: {req.from}</p>
          <div>
            <button className="btn" onClick={() => accept(req)}>Accept</button>
            <button className="btn danger" onClick={() => reject(req.id)}>Reject</button>
          </div>
        </div>
      ))}

      <h2>Outgoing</h2>
      {outgoing.length === 0 && (
        <p className="empty-text">No outgoing requests.</p>
      )}
      {outgoing.map(req => (
        <div key={req.id} className="request-card">
          <p>To: {req.to}</p>
        </div>
      ))}
    </div>
  );
}
