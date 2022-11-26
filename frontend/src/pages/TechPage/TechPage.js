import React from "react";
import "./TechPage.scss";
import {
  TimelessTechnology,
  DiamondsAreForever,
  TheWeakestLink,
  Decentralization,
  TimelessNFT,
  DecentralizedFiles,
  TimelessFiles,
  Decentralized99,
  OnChainScarcity,
} from "./TechPageContent";
import InfoPage from "components/InfoPage";
import AnimatedText from "components/AnimatedText";

const TechPage = () => {
  return (
    <InfoPage className="tech-page" teaser={{ src: "earth-and-moon.webm" }}>
      <div className="left-aligned-column general">
        <div className="leading-text">Timeless Technology</div>
        <TimelessTechnology />
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">Diamonds Are Forever</div>
        <AnimatedText className="text">
          <DiamondsAreForever />
        </AnimatedText>
        <div className="secondary-text">The Weakest Link</div>
        <AnimatedText className="text">
          <TheWeakestLink />
        </AnimatedText>
        <div className="secondary-text">Decentralization</div>
        <AnimatedText className="text">
          <Decentralization />
        </AnimatedText>
        <div className="secondary-text">Timeless NFT</div>
        <AnimatedText className="text">
          <TimelessNFT />
        </AnimatedText>
        <div className="secondary-text">Decentralized Files</div>
        <AnimatedText className="text">
          <DecentralizedFiles />
        </AnimatedText>
        <div className="secondary-text">Timeless Files</div>
        <AnimatedText className="text">
          <TimelessFiles />
        </AnimatedText>
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">99% Decentralized</div>
        <AnimatedText className="text">
          <Decentralized99 />
        </AnimatedText>
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">On-Chain Scarcity</div>
        <AnimatedText className="text">
          <OnChainScarcity />
        </AnimatedText>
      </div>
    </InfoPage>
  );
};

export default TechPage;
