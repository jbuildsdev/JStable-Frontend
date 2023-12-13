import { ethers } from "ethers";
import { useState } from "react";
import { JSTB_ABI, JSTB_ADDRESS } from "./contracts/JStable";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  console.log("ethers object:", ethers);

  const connectToMetamask = async () => {
    console.log("Connecting to MetaMask...");
    if (window.ethereum) {
      try {
        // Request account access
        console.log("Requesting account access...");
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Account access granted");
        setAccount(accounts[0]);
        console.log("Account:", accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        console.log("Provider set:", provider);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      console.log("MetaMask is not installed");
      alert("Please install MetaMask!");
    }
  };

  const connectToContract = async () => {
    console.log("Connecting to contract...");
    if (provider) {
      const signer = provider.getSigner();
      console.log("Signer:", signer);
      const contract = new ethers.Contract(JSTB_ADDRESS, JSTB_ABI, signer);
      setContract(contract);
      console.log("Contract connected:", contract);
    } else {
      console.log("Provider is not set");
    }
  };

  return (
    <div>
      <button onClick={connectToMetamask}>Connect to MetaMask</button>
      {account && (
        <button onClick={connectToContract}>Connect to Contract</button>
      )}
    </div>
  );
}

export default App;
