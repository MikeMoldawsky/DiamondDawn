import React from "react";
import { getCDNImageUrl } from "utils";
import CTAButton from "components/CTAButton";
import Countdown from "components/Countdown";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";

export const TheJourneyMainText = () => (
  <div className="text">
    <p>
      Diamond Dawn is a social experiment developed by a passionate team that’s
      made up of software engineers, visual artists, and a world-renowned 3D
      designer alongside one of the most respected companies in the diamond
      industry.
    </p>
    <p>Your Diamond Dawn journey will consist of 4 phases.</p>
    <p>
      At each phase, you must choose whether to evolve your Diamond NFT to its
      next form or keep it in its current state for eternity.
    </p>
    <p>
      You’ll have exactly <b>3 weeks, 3 days, and 3 hours</b> to complete each
      of the first 3 phases.
    </p>
    <div className="secondary-text">Which diamond will you choose?</div>
    <p>The fourth and final phase is longer.</p>
    <p>
      You’ll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide on your{" "}
      <b>Final Choice</b>:
    </p>
    <p>
      Keep your diamond NFT digital or burn it in exchange for a physical,
      limited-edition art piece that contains your diamond (GIA-certified).
    </p>
    <p>
      Once your decision is finalized on the blockchain, your physical art piece
      will be <b>shipped</b> to your specified address.
    </p>
  </div>
);

export const TheJourneyText = () => (
  <div className="text">
    <p>
      The Diamond Dawn project is <b>100% decentralized</b> - we do NOT hold
      your NFTs on a centralized server.
    </p>
    <p>
      Throughout this historical journey, you’ll learn about the hidden world of
      the diamond industry, take part in the creation of the{" "}
      <b>first digital diamonds</b> that live on the blockchain, and discover
      the secrets behind their famous sparkle.
    </p>
    Diamond Dawn has 4 phases.
  </div>
);

export const Phase0Text = () => (
  <div className="text">
    <p>
      If you are accepted to Diamond Dawn, you'll have exactly{" "}
      <b>3 days, 3 hours, and 3 minutes</b> to mint your key for 4.44 ETH.
    </p>
    <p>
      The key grants you <b>full access</b> to the 4 phases of DD's journey,
      starting in the virtual mine, where your journey begins.
    </p>
    <p>
      The application phase will automatically end when 333 participants
      activated their keys.
    </p>
    <p>
      <CTAButton />
    </p>
  </div>
);

export const Phase1Text = () => {
  const countdownProps = useMineOpenCountdown();

  return (
    <div className="text">
      <p>Diamond Dawn's mine will open in:</p>
      <Countdown align="left" {...countdownProps} />
    </div>
  );
};

export const Phase2Text = () => (
  <div className="text">
    <p>To be revealed.</p>
  </div>
);

export const Phase3Text = () => (
  <div className="text">
    <p>To be revealed.</p>
  </div>
);

export const Phase4Text = () => (
  <div className="text">
    <p>
      You'll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide:
    </p>
    <p>
      Keep your diamond digital (NFT) or <b>burn</b> it in exchange for your
      physical diamond art piece (GIA-certified).
    </p>
  </div>
);
