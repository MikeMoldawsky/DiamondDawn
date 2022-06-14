import React, { useState, useEffect } from "react";
import classNames from "classnames";
import animation from 'assets/video/tweezers-animation.mp4'
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

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className={classNames("page landing-page", { animate })}>
      <div className="centered-content">
        <h1>Physical <span>2</span> Digital</h1>
        <ReactPlayer
          url={animation}
          playing
          controls={false}
          muted
          loop
          className="react-player"
          width='100%'
          height='auto'
        />
        <div className="logo-box">
          <div className="by-text">BY</div>
          <div>
            <img src={tweezersLogo} alt="TWEEZERS" />
          </div>
        </div>
        <div className="bottom-text">
          <div>Request Vanguard Approval <FontAwesomeIcon icon={faPaperPlane} onClick={sendTwitterMsg} /></div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage