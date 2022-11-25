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

const TechPage = () => {
  return (
    <InfoPage className="tech-page" teaser={{ src: "earth-and-moon.webm" }}>
      <div className="left-aligned-column general">
        <div className="leading-text">Timeless Technology</div>
        <TimelessTechnology />
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">Diamonds Are Forever</div>
        <DiamondsAreForever />
        <div className="secondary-text">The Weakest Link</div>
        <TheWeakestLink />
        <div className="secondary-text">Decentralization</div>
        <Decentralization />
        <div className="secondary-text">Timeless NFT</div>
        <TimelessNFT />
        <div className="secondary-text">Decentralized Files</div>
        <DecentralizedFiles />
        <div className="secondary-text">Timeless Files</div>
        <TimelessFiles />
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">99% Decentralized</div>
        <Decentralized99 />
      </div>
      <div className="left-top-aligned-column content-section">
        <div className="leading-text">On-Chain Scarcity</div>
        <OnChainScarcity />
      </div>
    </InfoPage>
  );
};

export default TechPage;
