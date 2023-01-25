import React from "react";
import "./TechPage.scss";
import {
  TimelessTechnology,
  DiamondsAreForever,
  TheWeakestLink,
  Decentralization,
  TimelessNFT,
  EthereumLimit,
  DecentralizedFiles,
  Decentralized99,
  OnChainScarcity,
} from "./TechPageContent";
import InfoPage from "components/InfoPage";
import AnimatedText from "components/AnimatedText";
import { getEarthAndMoonVideo } from "assets/videos";
import useWindowDimensions from "hooks/useWindowDimensions";

const TechPage = () => {
  const { width, height } = useWindowDimensions();

  return (
    <InfoPage
      className="tech-page"
      teaser={{ src: getEarthAndMoonVideo(width, height) }}
    >
      <div className="left-aligned-column general">
        <div className="leading-text">Timeless Technology</div>
        <TimelessTechnology />
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="left-top-aligned-column">
          <div className="subtitle-text">Diamonds Are Forever</div>
          <AnimatedText className="text">
            <DiamondsAreForever />
          </AnimatedText>
          <div className="tagline-text">The Weakest Link</div>
          <AnimatedText className="text">
            <TheWeakestLink />
          </AnimatedText>
          <div className="tagline-text">Decentralization</div>
          <AnimatedText className="text">
            <Decentralization />
          </AnimatedText>
          <div className="tagline-text">Timeless NFT</div>
          <AnimatedText className="text">
            <TimelessNFT />
          </AnimatedText>
          <div className="tagline-text">Ethereum's Limit</div>
          <AnimatedText className="text">
            <EthereumLimit />
          </AnimatedText>
          <div className="tagline-text">Decentralized Files</div>
          <AnimatedText className="text">
            <DecentralizedFiles />
          </AnimatedText>
        </div>
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="left-top-aligned-column">
          <div className="subtitle-text">99% Decentralized</div>
          <AnimatedText className="text">
            <Decentralized99 />
          </AnimatedText>
        </div>
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="left-top-aligned-column">
          <div className="subtitle-text">On-Chain Scarcity</div>
          <AnimatedText className="text">
            <OnChainScarcity />
          </AnimatedText>
        </div>
      </div>
    </InfoPage>
  );
};

export default TechPage;
