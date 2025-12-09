import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc
} from "firebase/firestore";

function shortAddress(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export default function Users() {
  const [wallet, setWallet] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendMeta, setFriendMeta] = useState({});
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const w = localStorage.getItem("wallet");
    setWallet(w);
    loadUsers();
    loadFriendshipData(w);
  }, []);

  // LOAD ALL USERS (wallet addresses only)
  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map(d => ({ id: d.id })));
  }

  async function loadFriendshipData(w) {
    const meSnap = await getDocs(
      query(collection(db, "users"), where("__name__", "==", w))
    );

    if (!meSnap.empty) {
      const me = meSnap.docs[0].data();
      setFriends(me.friends || []);
      setFriendMeta(me.friendMeta || {});
    }

    const incomingSnap = await getDocs(
      query(collection(db, "friendRequests"), where("to", "==", w))
    );
    setIncoming(incomingSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    const outgoingSnap = await getDocs(
      query(collection(db, "friendRequests"), where("from", "==", w))
    );
    setOutgoing(outgoingSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function sendRequest(to) {
    await addDoc(collection(db, "friendRequests"), {
      from: wallet,
      to,
      status: "pending"
    });
    loadFriendshipData(wallet);
  }

  function getStatus(user) {
    if (user === wallet) return "you";
    if (friends.includes(user)) return "friend";
    if (outgoing.some(r => r.to === user)) return "outgoing";
    if (incoming.some(r => r.from === user)) return "incoming";
    return "none";
  }

  // ✅ SEARCH by wallet address OR saved nickname
  const filtered = users.filter(u => {
    const s = search.toLowerCase();

    const addrMatch = u.id.toLowerCase().includes(s);
    const nickname = friendMeta[u.id]?.nickname?.toLowerCase() || "";
    const nickMatch = nickname.includes(s);

    return addrMatch || nickMatch;
  });

  return (
    <div className="users1-page">
      <h1>All Users</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by address or saved nickname…"
        className="search-box"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.map(u => {
        const status = getStatus(u.id);
        const savedNickname = friendMeta[u.id]?.nickname;

        return (
          <div key={u.id} className="user-card">

            {/* LEFT SIDE */}
            <div className="left">
              <strong className="addr">{shortAddress(u.id)}</strong>

              {savedNickname && (
                <p className="nickname">({savedNickname})</p>
              )}

              {/* Hover Card */}
              {friendMeta[u.id] && (
                <div className="hover-card">
                  <p><strong>Nickname:</strong> {friendMeta[u.id].nickname}</p>
                  <p><strong>Bio:</strong> {friendMeta[u.id].bio}</p>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            {status === "you" && <span className="you">(You)</span>}

            {status === "friend" && (
              <button className="btn disabled">Already Friends</button>
            )}

            {status === "outgoing" && (
              <button className="btn disabled">Request Sent</button>
            )}

            {status === "incoming" && (
              <button className="btn highlight">Accept Request</button>
            )}

            {status === "none" && (
              <button className="btn" onClick={() => sendRequest(u.id)}>
                Add Friend
              </button>
            )}

          </div>
        );
      })}
    </div>
  );
}
