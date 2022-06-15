import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import videos from "./video";
import "./css/app.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeXmark,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  createClient,
  infuraRpcUrls,
  WagmiConfig,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import Wallet from "pages/Wallet";
import "@rainbow-me/rainbowkit/dist/index.css";

function App() {
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(true);
  const [hideContent, setHideContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [src, setSrc] = useState(videos[0]);
  let player = useRef(null);

  const gotoNextStep = () => {
    if (step > 1) return;
    handleHideContent();
    setTimeout(() => {
      // player.current.seekTo(0)
      setStep(step + 1);
    }, 250);
  };

  const handleHideContent = (onEnd) => {
    setHideContent(true);
    setTimeout(() => {
      setHideContent(false);
      onEnd && onEnd();
      setIsPlaying(true);
    }, 500);
  };

  const replayVideo = () => {
    handleHideContent(() => player.current.seekTo(0));
  };

  useEffect(() => {
    setTimeout(() => {
      // player.current.seekTo(8)
      setIsPlaying(false);
    }, 7000);
  }, [step]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     player.current.seekTo(8)
  //   }, 500)
  // }, [])

  console.log({ step, isPlaying, hideContent });

  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon],
    [
      infuraProvider({ infuraId: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
      publicProvider(),
    ]
  );

  // const { connectors } = getDefaultWallets({
  //   appName: "tweezers",
  //   chains,
  // });

  // const connectors = connectorsForWallets([
  //   {
  //     groupName: "Recommended",
  //     wallets: [
  //       wallet.metaMask({ chains }),
  //       wallet.coinbase({ chains }),
  //       wallet.walletConnect({ chains }),
  //     ],
  //   },
  // ]);
  const { connectors } = getDefaultWallets({
    appName: "tweezers App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div
          className={classNames("app", {
            "show-content": !isPlaying,
            "hide-content": hideContent,
          })}
        >
          <header>
            <Wallet />
            <FontAwesomeIcon
              icon={muted ? faVolumeXmark : faVolumeHigh}
              onClick={() => setMuted(!muted)}
            />
          </header>
          <ReactPlayer
            ref={player}
            url="https://media.niftygateway.com/video/upload/v1638166907/Andrea/DavidAriew/DecVerified/SIRENSVERSE_yocjuq.mp4"
            playing={isPlaying}
            playsinline={true}
            controls={false}
            muted={muted}
            volume={1}
            className="react-player"
            // width='unset'
            // height='unset'
            // onPlay={() => setIsPlaying(true)}
            // onEnded={() => setIsPlaying(false)}
          />
          <div className="content" onClick={gotoNextStep}>
            Step {step}
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
