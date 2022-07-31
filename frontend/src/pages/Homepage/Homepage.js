import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
// import animation from "assets/video/infinity_video.mp4";
// import ReactPlayer from "react-player";
import './Homepage.scss'
import CommonView from "components/CommonView";
import SVG from "components/SVG";
import scrollMarker from 'assets/images/scroll-marker.svg'
import VideoPlayer from "components/VideoPlayer";
// import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import infinityLogo from 'assets/images/infinity-logo.png'
import blackStone from 'assets/images/black-stone.png'
import PasswordBox from "components/PasswordBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {NavLink, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {systemSelector} from "store/systemReducer";
import WagmiWrapper from "layout/WagmiWrapper";
import Header from "components/Header";
import ContractProvider from "layout/ContractProvider";
import DiamondList from "components/DiamondList";
import Wallet from "components/Wallet";
import useSystemLoader from "hooks/useSystemLoader";

const HomepageInternal = () => {
  const { stage, isStageActive } = useSelector(systemSelector)
  const [hasEntered, setHasEntered] = useState(false)
  const navigate = useNavigate()

  const isReady = useSystemLoader()

  const canEnter = stage > 0 || isStageActive

  const onCorrectPassword = () => {
    // setHasEntered(true)
    navigate('/process')
  }

  return (
    <div className={classNames("page homepage", { 'entered': hasEntered })} >
      <div className="bg-stars" />
      <div className="bg" />
      <div className="box box-top">
        <CommonView leadingText="A BILLION YEARS IN THE MAKING"
                    secondaryText="the first ever diamond mining experience, from NFT to reality">
          <img src={infinityLogo} alt={''} />
        </CommonView>
        {canEnter && (
          <NavLink to={`/process`}>
            <div className="button" style={{ marginTop: 40 }}>ENTER THE MINE</div>
          </NavLink>
        )}
        <a href="#video">
          <SVG src={scrollMarker} className="scroll-marker" />
        </a>
      </div>
      <div id="video" className="box center-aligned-column box-middle">
        <VideoPlayer noVideo>
          {/*<OndemandVideoIcon />*/}
          <div>TEASER VIDEO</div>
        </VideoPlayer>
      </div>
      <div className="box center-aligned-column box-bottom">
        {/*<div className="bg" />*/}
        <CommonView leadingText={["EVERY BIRTH OF A DIAMOND IS A MIRACLE OF NATURE,", "BEGINNING ONLY AS A MERE POTENTIAL"]}
                    secondaryText="Do you have what it takes to shine?">
          <img src={blackStone} alt="Diamond" />
        </CommonView>
        <PasswordBox onCorrect={onCorrectPassword} />
        <div className="center-aligned-column join-us">
          <div>join us on this unequaled experience</div>
          <div className="button inverted icon-after">
            Stay updated on Twitter <FontAwesomeIcon icon={faTwitter} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Homepage = () => {
  return (
    <WagmiWrapper>
      <Header>
        <ContractProvider>
          <DiamondList />
        </ContractProvider>
        <Wallet />
      </Header>
      <ContractProvider>
        <HomepageInternal />
      </ContractProvider>
    </WagmiWrapper>
  )
}

export default Homepage;
