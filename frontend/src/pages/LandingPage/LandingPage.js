import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import animation from "assets/video/animation.mp4";
import tweezersLogo from "assets/images/logo-with-text.png";
import ReactPlayer from "react-player";
import 'css/app.scss'
import './LandingPage.scss'

const PASSWORD_LENGTH = 10
const CHECK_TIME = 1750

const LandingPage = () => {
  const [animate, setAnimate] = useState(false);
  const [password, setPassword] = useState("");
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const onPasswordChange = e => {
    console.log({e})
    const pwd = e.target.value
    setPassword(pwd)
    if (pwd.length === PASSWORD_LENGTH) {
      pwdInput.current.blur()
      setCheckingPassword(true)
      setTimeout(() => {
        setCheckingPassword(false)
        setPasswordError(true)
        setPassword('')
      }, CHECK_TIME)
    }
  };

  const onResultClick = () => {
    setPasswordError(false)
  }

  const onViewClick = () => {
    if (pwdInput && pwdInput.current && !checkingPassword && !passwordError) {
      pwdInput.current.focus();
    }
  };

  return (
    <div
      className={classNames("page landing-page", { animate })}
      onClick={onViewClick}
    >
      <div className="bg" />
      <header>
        <div className="logo-box">
          <div className="by-text">BY</div>
          <img src={tweezersLogo} alt="TWEEZERS" />
        </div>
      </header>
      <div className="centered-content">
        <div className="top-content">
          <h1>A BILLION YEARS IN THE MAKING</h1>
          <ReactPlayer
            url={animation}
            playing
            playsinline
            controls={false}
            muted
            loop
            className="react-player"
            width='300px'
            height='auto'
          />
          <div className="title">DIAMONDS DAWN</div>
          <div className="coming-soon">COMING SOON</div>
        </div>
        {!passwordError ? (
          <div className="password-box">
            <div className="pwd-bg"/>
            <div className="password-title">TRY PASSWORD</div>
            <input ref={pwdInput} type="password" autoFocus
                   className={classNames({filled: password.length > 0, loading: checkingPassword})}
                   value={password} onChange={onPasswordChange} maxLength={PASSWORD_LENGTH} />
          </div>
        ) : (
          <div className="password-error">
            <div className="error-message">Wrong Password</div>
            <div className="request-join">
              <a target="_blank" rel="noreferrer" href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20">
                <div>Request Vanguard Approval</div>
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="remainder" />
    </div>
  );
};

export default LandingPage;
