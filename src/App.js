import logo from './tweezers_logo.png';
import './App.css';

function App() {
  const twitterMsgLink = 'https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20💎';
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Tweezers 2022.
        </p>
        Coming Soon...
        <p>
              Are you in the Vanguard List?
        </p>
          <a href={twitterMsgLink} target="_blank" rel="noreferrer noopener">
              Twitter
          </a>
      </header>
    </div>
  );
}

export default App;
