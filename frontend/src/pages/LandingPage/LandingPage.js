import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import animation from "assets/video/infinity_video_sm.mp4";
import tweezersLogo from "assets/images/logo.png";
import ReactPlayer from "react-player";
import 'css/app.scss'
import './LandingPage.scss'
import OtpInput from 'react-otp-input';

const PASSWORD_LENGTH = 4
const CHECK_TIME = 1750

const LandingPage = () => {
  const [animate, setAnimate] = useState(false);
  const [password, setPassword] = useState("");
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const submitPassword = () => {
    setCheckingPassword(true)
    setTimeout(() => {
      setCheckingPassword(false)
      setPasswordError(true)
      setPassword('')
    }, CHECK_TIME)
  }

  const onPasswordChange = pwd => {
    setPassword(pwd)
    if (pwd.length === PASSWORD_LENGTH) {
      submitPassword()
    }
  };

  // const onResultClick = () => {
  //   setPasswordError(false)
  // }

  return (
    <div className={classNames("page landing-page", { animate })}>
      <div className="bg" />
      <header>
        <div className="logo-box">
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
            className="react-player"
          />
          <div className="title">DIAMONDS DAWN</div>
          <div className="coming-soon">COMING SOON</div>
        </div>
        {!passwordError ? (
          <div className={classNames("password-box", { loading: checkingPassword })}>
            <div className="pwd-bg"/>
            <div className="password-title">TRY PASSWORD</div>
            <OtpInput containerStyle={classNames("pwd-input")} value={password} onChange={onPasswordChange} numInputs={4} shouldAutoFocus isInputSecure />
          </div>
        ) : (
          <div className="password-error">
            <div className="error-message">Wrong Password</div>
            <div className="request-join">
              <a target="_blank" rel="noreferrer" href="https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20">
                <div className="request-join-text">Request Vanguards</div>
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
