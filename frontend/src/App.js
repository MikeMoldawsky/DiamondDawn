import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player"
import videos from './video'
import './css/app.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faVolumeHigh, faVolumeXmark, faRefresh } from '@fortawesome/free-solid-svg-icons'
import classNames from "classnames";

function App() {
  const [step, setStep] = useState(0)
  const [muted, setMuted] = useState(true)
  const [hideContent, setHideContent] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [src, setSrc] = useState(videos[0])
  let player = useRef(null)

  const gotoNextStep = () => {
    if (step > 1) return
    handleHideContent()
    setTimeout(() => {
      // player.current.seekTo(0)
      setStep(step + 1)
    }, 250)
  }

  const handleHideContent = onEnd => {
    setHideContent(true)
      setTimeout(() => {
        setHideContent(false)
        onEnd && onEnd()
        setIsPlaying(true)
      }, 500)
  }

  const replayVideo = () => {
    handleHideContent(() => player.current.seekTo(0))
  }

  useEffect(() => {
    setTimeout(() => {
      // player.current.seekTo(8)
      setIsPlaying(false)
    }, 7000)
  }, [step])

  // useEffect(() => {
  //   setTimeout(() => {
  //     player.current.seekTo(8)
  //   }, 500)
  // }, [])

  console.log({step, isPlaying, hideContent})

  return (
    <div className={classNames("app", {"show-content": !isPlaying, "hide-content": hideContent})}>
      <header>
        {/*<div className="replay-btn">*/}
        {/*  <FontAwesomeIcon icon={faRefresh} onClick={replayVideo} />*/}
        {/*</div>*/}
        <FontAwesomeIcon icon={muted ? faVolumeXmark : faVolumeHigh} onClick={() => setMuted(!muted)} />
      </header>
      <ReactPlayer ref={player} url="https://media.niftygateway.com/video/upload/v1638166907/Andrea/DavidAriew/DecVerified/SIRENSVERSE_yocjuq.mp4"
                   playing={isPlaying}
                   controls={false}
                   muted={muted}
                   volume={1}
                   className="react-player"
                   // width='unset'
                   // height='unset'
                   // onPlay={() => setIsPlaying(true)}
                   // onEnded={() => setIsPlaying(false)}
      />
      <div className="content" onClick={gotoNextStep}>Step {step}</div>
    </div>
  );
}

export default App;
