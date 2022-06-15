import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import animation from 'assets/video/animation.mp4'
import tweezersLogo from 'assets/images/logo-with-text.png'
import ReactPlayer from "react-player";
import 'css/app.scss'
import './LandingPage.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function sendTwitterMsg() {
  const twitterMsgLink =
      "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20💎";
  window.open(twitterMsgLink, "_blank");
}

const LandingPage = () => {
  const [animate, setAnimate] = useState(false)
  const [password, setPassword] = useState('')
  const pwdInput = useRef(null)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const onPasswordChange = e => {
    console.log({e})
    const pwd = e.target.value
    setPassword(pwd)
    if (pwd.length === 6) {
      pwdInput.current.blur()
    }
  }

  return (
    <div className={classNames("page landing-page", { animate })}>
      <header>
        <div className="logo-box">
          <div className="by-text">BY</div>
          <img src={tweezersLogo} alt="TWEEZERS" />
        </div>
      </header>
      <div className="centered-content">
        <h1>A BILLION YEARS IN THE MAKING</h1>
        <ReactPlayer
          url={animation}
          playing
          controls={false}
          muted
          loop
          className="react-player"
          width='300px'
          height='auto'
        />
        <div className="coming-soon">COMING SOON</div>
        {/*<div className="password-box">*/}
        {/*  <h2>Enter Password</h2>*/}
        {/*  <input ref={pwdInput} type="password" autoFocus className={classNames({filled: password.length > 0})} value={password} onChange={onPasswordChange} maxLength={6} />*/}
        {/*</div>*/}
        {/*<div className="bottom-text">*/}
        {/*  <div>Request Vanguard Approval <FontAwesomeIcon icon={faPaperPlane} /></div>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default LandingPage