import React from "react";
import { getCDNImageUrl } from "utils";

export const AboutDiamondDawnText = () => (
  <div className="text">
    <p>
      Diamond Dawn is a social experiment developed by a passionate team that’s
      made up of software engineers, visual artists, and a world-renowned 3D
      designer alongside one of the most respected companies in the diamond
      industry.
    </p>
    <p>Your Diamond Dawn journey will consist of 4 steps.</p>
    <p>
      At each step, you must choose whether to evolve your Diamond NFT to its
      next form or keep it in its current state for eternity. You’ll have
      exactly <b>3 weeks, 3 days, and 3 hours</b> to complete each step.
    </p>
    <div className="secondary-text">Which diamond will you choose?</div>
    <p>
      In the last phase, you will be faced with <b>The Final Choice:</b>
    </p>
    <p>
      Keep your diamond NFT digital or burn it in exchange for a physical,
      limited-edition artwork that contains your diamond (GIA-certified).
    </p>
    <p>
      Once your decision is finalized on the blockchain, your artwork will be{" "}
      <b>shipped</b> to your specified address.
    </p>
  </div>
);

export const TheJourneyText = () => (
  <div className="text">
    <p>
      Diamond Dawn project is <b>entirely on-chain</b> - we do NOT hold your
      NFTs on a centralized server.
    </p>
    <p>
      Throughout this historical journey, you’ll learn about the hidden world of
      the diamond industry, take part in the creation of the{" "}
      <b>first digital diamonds</b> that live on the blockchain, and discover
      the secrets behind their famous sparkle.
    </p>
    Diamond Dawn has 4 steps.
  </div>
);

export const Step0Text = () => (
  <div className="text">
    <p>
      If your application to join Diamond Dawn is accepted, you will have a
      limited time window of <b>3 days, 3 hours, and 3 minutes</b> to activate
      your key for 3.33 $ETH.
    </p>
    <p>
      The key grants you <b>full access</b> to the 4 steps of DD's journey,
      starting in the virtual mine, where your journey begins.
    </p>
    <p>
      The application phase will automatically end when one of the following
      things happens:
    </p>
    <ul>
      <li>333 participants activated their keys</li>
      <li>The mine opens in...</li>
    </ul>
  </div>
);

export const Step1Text = () => (
  <div className="text">
    <p>The virtual mine opens in XX:XX</p>
  </div>
);

export const Step2Text = () => null;

export const Step3Text = () => null;

export const Step4Text = () => (
  <div className="text">
    <p>
      The final step is unique, and that's why you’ll have a longer time window
      to decide about your actions.
    </p>
    <p>
      You'll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide.
    </p>
    <p>In this final phase, you'll be faced with the ultimate decision:</p>
    <p>
      Keep your diamond digital (NFT) or <b>burn</b> it in exchange for your
      physical diamond artwork (GIA-certified).
    </p>
    <img
      className="certificate"
      src={getCDNImageUrl("certificate.svg")}
      alt=""
    />
  </div>
);

export const OurTeamText = () => (
  <div className="text our-team">
    <p>
      Diamond Dawn was created by a team of forward-thinking individuals from
      various fields who share a common set of values.
    </p>
    <p>
      We all believe that <b>decentralization</b> is key to the Internet’s
      survival.
    </p>
    <p>
      We look forward to the day when the robust technology behind Web3 and NFTs
      will disrupt most industries as we know them today, resulting in a shift
      in “power” from corporations to individuals.
    </p>
    <p>
      Diamond Dawn was specifically architectured to demonstrate how
      decentralized technology can create a <b>REAL-LIFE</b> impact.
    </p>
  </div>
);

export const MikeText = () => (
  <div className="text">
    <p>
      An entrepreneur and early adopter by nature, Mike foresaw the immense
      power behind web3’s disruptive tech several years ago. He has since left
      his position at Palantir R&D (where he worked as a software engineer for 4
      years) to pursue his passion for decentralized technology. His projects
      aim to push the technology forward to a state where it creates a REAL-LIFE
      impact for society at large. Mike holds a BSc in Computer Science from Tel
      Aviv University.
    </p>
  </div>
);

export const DavidText = () => (
  <div className="text">
    <p>
      A digital artist and educator for over 10 years, David has worked on NFT
      projects with some of the world's biggest digital artists, such as Beeple
      and Pak. Recently, he sold his first{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://www.sothebys.com/en/buy/auction/2022/contemporary-art-evening-sale/jia-aili-x-david-ariew-jia-ai-li-x-da-weiai-lu-the"
      >
        artwork
      </a>
      at Sotheby’s Contemporary Art Evening for $224K, alongside artworks by
      Banksy and Basquiat. In addition, he created 2 out of the 3{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://twitter.com/beeple/status/1525142908680257536"
      >
        Beeple X Madonna
      </a>{" "}
      NFTs (one of which sold for $346K) and has collaborated with top artists
      and brands such as Katy Perry, Deadmau5, and Intel. David holds a Master's
      degree in Neuroscience from UVA.
    </p>
  </div>
);

export const TonyText = () => (
  <div className="text">
    <p>
      Tony is an immigrant activist who happened to also collect a lot of
      Cryptopunks. He has since become a major NFT collector.
    </p>
  </div>
);

export const AvivaText = () => (
  <div className="text">
    <p>
      Born to a family of diamond merchants, Aviva has known the diamond
      industry intimately for over 35 years. A highly-respected name in the
      diamond world, the Moldawsky family, has supplied precious stones to
      Tiffany’s, Sterling, JC Penny, and more of the world’s largest diamond
      sellers. As a passionate diamond designer, Aviva oversees the entire
      design process for her clients - from selecting the right stone, to the
      most exquisite setting and design, right down to the display and packaging
      in which it is delivered to the client.
    </p>
  </div>
);

export const AsafText = () => (
  <div className="text">
    <p>
      A front-end developer for over 15 years. Asaf discovered the world of
      blockchain technology 3 years ago and has worked exclusively on web3
      projects. Asaf lives and breathes crypto and is an active member of
      several DAOs (decentralized autonomous organizations). He believes that
      decentralization is the key to the Internet’s survival and insists that
      music and art set us apart and make us shine as a species.
    </p>
  </div>
);
