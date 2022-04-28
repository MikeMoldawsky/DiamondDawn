import logo from "./tweezers_logo.png";
import "./App.css";
import { Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ethers } from "ethers";
import { useState } from "react";

function sendTwitterMsg() {
  const twitterMsgLink =
    "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20💎";
  window.open(twitterMsgLink, "_blank");
}

function App() {
  const [currentAccount, setCurrentAccount] = useState();
  const [ensName, setEnsName] = useState();

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log(`ethereum is not configured`);
      return;
    }
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(ethereum);
    // MetaMask requires requesting permission to connect users accounts
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts || accounts.length === 0) {
      console.log(`Accounts are not configured or empty`, { accounts });
      return;
    }
    const name = await provider.lookupAddress(accounts[0]);
    setCurrentAccount(accounts[0]);
    setEnsName(name);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Grid container justifyContent="flex-end">
          <Button variant="contained" onClick={connectWallet}>
            Connect
          </Button>
        </Grid>
        <h1>Tweezers 2022.</h1>
        <br />
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        <h2>Coming Soon...</h2>
        <div>
          {ensName
            ? ensName
            : currentAccount
            ? `0x...${currentAccount.substring(currentAccount.length - 4)}`
            : undefined}
        </div>
        Are you in The Vanguard List?
        <br />
        <br />
        <Button
          variant="contained"
          onClick={sendTwitterMsg}
          endIcon={<SendIcon />}
        >
          Join
        </Button>
      </header>
    </div>
  );
}

export default App;
