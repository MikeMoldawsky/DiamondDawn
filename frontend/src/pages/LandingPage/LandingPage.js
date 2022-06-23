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
  const pwdInput = useRef(null);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const submitPassword = () => {
    // pwdInput.current.blur()
    setCheckingPassword(true)
    setTimeout(() => {
      setCheckingPassword(false)
      setPasswordError(true)
      setPassword('')
    }, CHECK_TIME)
  }

  const onPasswordChange = pwd => {
    // const pwd = e.target.value
    setPassword(pwd)
    if (pwd.length === PASSWORD_LENGTH) {
      submitPassword()
    }
  };

  const onPasswordEnter = e => {
    if (e.charCode === 13) {
      // enter key
      submitPassword()
    }
  }

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
            // loop
            className="react-player"
            // width="auto"
            // height="180px"
          />
          <div className="title">DIAMONDS DAWN</div>
          <div className="coming-soon">COMING SOON</div>
        </div>
        {!passwordError ? (
          <div className={classNames("password-box", { loading: checkingPassword })}>
            <div className="pwd-bg"/>
            <div className="password-title">TRY PASSWORD</div>
            <OtpInput containerStyle={classNames("pwd-input")} value={password} onChange={onPasswordChange} numInputs={4} shouldAutoFocus isInputSecure />
            {/*<input ref={pwdInput} type="password" autoFocus*/}
            {/*       className={classNames({filled: password.length > 0, loading: checkingPassword})}*/}
            {/*       value={password} onChange={onPasswordChange} onKeyPress={onPasswordEnter} maxLength={PASSWORD_LENGTH} />*/}
            {/*<div className="password-underscores">*/}
            {/*  <div className="underscore" />*/}
            {/*  <div className="underscore" />*/}
            {/*  <div className="underscore" />*/}
            {/*  <div className="underscore" />*/}
            {/*</div>*/}
          </div>
        ) : (
          <div className="password-error">
            <div className="error-message" onClick={onResultClick}>Wrong Password</div>
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
