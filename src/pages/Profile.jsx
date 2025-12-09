import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion
} from "firebase/firestore";
function shortAddress(addr) {
  return addr.slice(0, 6) + "…" + addr.slice(-6);
}

function FriendCard({ wallet, meta, onSave, onUnfriend, onBlock }) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(meta?.nickname || "");
  const [bio, setBio] = useState(meta?.bio || "");

  function save() {
    onSave(wallet, nickname, bio);
    setEditing(false);
  }

  return (
    <div className="friend-card">
      <h3>Wallet: {shortAddress(wallet)}</h3>


      {editing ? (
        <>
          <input
            className="text-input"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <textarea
            className="text-area"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button className="btn" onClick={save}>Save</button>
          <button className="btn secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p><strong>Nickname:</strong> {nickname || "Not set"}</p>
          <p><strong>Bio:</strong> {bio || "No bio yet"}</p>

          <button className="btn" onClick={() => setEditing(true)}>
            Edit
          </button>

          <button className="btn danger" onClick={() => onUnfriend(wallet)}>
            Unfriend
          </button>

          <button className="btn danger" onClick={() => onBlock(wallet)}>
            Block
          </button>
        </>
      )}
    </div>
  );
}

export default function Profile() {
  const [wallet, setWallet] = useState("");
  const [me, setMe] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendMeta, setFriendMeta] = useState({});

  useEffect(() => {
    const w = localStorage.getItem("wallet");
    setWallet(w);
    loadProfile(w);
  }, []);

  async function loadProfile(w) {
    const docRef = doc(db, "users", w);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return;

    const data = snap.data();
    setMe(data);
    setFriendMeta(data.friendMeta || {});

    // Load full friend data
    const friendDocs = await Promise.all(
      (data.friends || []).map((f) => getDoc(doc(db, "users", f)))
    );

    setFriends(
      friendDocs.map((fd) => ({
        id: fd.id,
        ...fd.data()
      }))
    );
  }

  async function saveFriendMeta(friendWallet, nickname, bio) {
    const userRef = doc(db, "users", wallet);

    await updateDoc(userRef, {
      [`friendMeta.${friendWallet}`]: {
        nickname,
        bio
      }
    });

    loadProfile(wallet);
  }

  async function unfriend(friendWallet) {
    const userRef = doc(db, "users", wallet);
    const friendRef = doc(db, "users", friendWallet);

    await updateDoc(userRef, {
      friends: arrayRemove(friendWallet)
    });

    await updateDoc(friendRef, {
      friends: arrayRemove(wallet)
    });

    loadProfile(wallet);
  }

  async function blockUser(friendWallet) {
    const userRef = doc(db, "users", wallet);

    await updateDoc(userRef, {
      blocked: arrayUnion(friendWallet),
      friends: arrayRemove(friendWallet)
    });

    loadProfile(wallet);
  }

  return (
    <div className="page">
      <h1>Your Profile</h1>

      <h3>Wallet: {wallet}</h3>

      <h2>Your Friends</h2>

      {friends.length === 0 && <p>No friends yet.</p>}

      {friends.map((f) => (
        <FriendCard
          key={f.id}
          wallet={f.id}
          meta={friendMeta[f.id]}
          onSave={saveFriendMeta}
          onUnfriend={unfriend}
          onBlock={blockUser}
        />
      ))}
    </div>
  );
}
