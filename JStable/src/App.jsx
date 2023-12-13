import Web3 from "web3";
import { useState } from "react";
import { JSTB_ADDRESS, JSTB_ABI } from "./contracts/JStable";

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState(null);
  const [contract, setContract] = useState(null);
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");

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
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      console.log("MetaMask is not installed");
      alert("Please install MetaMask!");
    }
  };

  const getWeb3 = async () => {
    console.log("Getting Web3...");
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);
      console.log("Web3 set:", web3);
    } else {
      console.log(
        "window.ethereum is not defined. Please connect to MetaMask first."
      );
    }
  };

  const getBalance = async () => {
    if (web3 && account) {
      const balance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(balance, "ether"));
    } else {
      console.log(
        "Web3 or account is not initialized. Please connect to MetaMask and initialize Web3 first."
      );
    }
  };

  const connectToContract = async () => {
    if (web3) {
      const contract = new web3.eth.Contract(JSTB_ABI, JSTB_ADDRESS);
      setContract(contract);
      console.log("Contract set:", contract);
    } else {
      console.log(
        "Web3 is not initialized. Please connect to MetaMask and initialize Web3 first."
      );
    }
  };

  const mintTokens = async () => {
    if (contract && mintAddress && mintAmount) {
      try {
        await contract.methods
          .mint(mintAddress, mintAmount)
          .send({ from: account });
        console.log("Minting successful");
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      console.log(
        "Contract, mint address or mint amount is not set. Please connect to the contract and enter the mint address and amount first."
      );
    }
  };

  return (
    <div>
      <button onClick={connectToMetamask}>Connect to MetaMask</button>
      <button onClick={getWeb3}>Get Web3</button>
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={connectToContract}>Connect to Contract</button>
      {balance && <p>Your balance is {balance} ETH</p>}
      <input
        type="text"
        placeholder="Mint Address"
        value={mintAddress}
        onChange={(e) => setMintAddress(e.target.value)}
      />
      <input
        type="number"
        placeholder="Mint Amount"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
      />
      <button onClick={mintTokens}>Mint Tokens</button>
    </div>
  );
}

export default App;
