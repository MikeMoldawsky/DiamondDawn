import logo from "../tweezers_logo.png";
import "../App.css";
import { Button, Grid } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import onboard from "../components/OnboardWallet";
const _ = require("lodash");

function sendTwitterMsg() {
  const twitterMsgLink =
    "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20💎";
  window.open(twitterMsgLink, "_blank");
}

function HomePage() {
  const [ensName, setEnsName] = useState();

  async function connectWallet() {
    try {

      const wallets = await onboard.connectWallet()
      console.log(wallets);
      const ensName = _.get(wallets, '[0].accounts[0].ens.name');

      if(!ensName) {
        const address = _.get(wallets, '[0].accounts[0].address');
        setEnsName(`0x...${address.substring(address.length - 4)}`);
      } else {
        setEnsName(ensName);
      }
    } catch (e){
      console.log(`exception in connect wallet ${e}`);
      alert(`exception in connect wallet ${e}`);
    }
  }

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
          { ensName }
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

export default HomePage;
