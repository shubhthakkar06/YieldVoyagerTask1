import { connectWallet } from "../web3";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Connect() {
  const navigate = useNavigate();

  async function handleConnect() {
    const wallet = await connectWallet();
    if (!wallet) return;

    const userRef = doc(db, "users", wallet);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        wallet,
        friends: [],
        username: ""
      });
    }

    navigate("/users");
  }

  return (
    <div className="page">
      <div class = "connector"><h1 class ="page-h1">Please Connect MetaMask Account</h1></div>
      <div class="btn-box"><button onClick={handleConnect} className="btn">Connect Wallet</button></div>
    </div>
  );
}
