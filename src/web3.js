import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
