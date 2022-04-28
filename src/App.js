import logo from "./tweezers_logo.png";
import "./App.css";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function App() {
  function sendTwitterMsg() {
    const twitterMsgLink =
      "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20💎";
    window.open(twitterMsgLink, "_blank");
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <h1>Tweezers 2022.</h1>
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <br />
        <h2>Coming Soon...</h2>
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
