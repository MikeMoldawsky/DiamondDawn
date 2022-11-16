import React from "react";
import { getCDNImageUrl } from "utils";

export const TheJourneyMainText = () => (
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
      next form or keep it in its current state for eternity.
    </p>
    <p>
      You’ll have exactly <b>3 weeks, 3 days, and 3 hours</b> to complete each
      step.
    </p>
    <div className="secondary-text">Which diamond will you choose?</div>
    <p>The last step is longer.</p>
    <p>
      You’ll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide on your{" "}
      <b>Final Choice</b>:
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
      If your are accepted to Diamond Dawn, you'll have exactly{" "}
      <b>3 days, 3 hours, and 3 minutes</b> to activate your key for 3.33 $ETH.
    </p>
    <p>
      The key grants you <b>full access</b> to the 4 steps of DD's journey,
      starting in the virtual mine, where your journey begins.
    </p>
    <p>
      The application phase will automatically end when 333 participants
      activated their keys.
    </p>
  </div>
);

export const Step1Text = () => (
  <div className="text">
    <p>Diamond Dawn's mine will open in 3 weeks, 3 days, and 3 hours.</p>
  </div>
);

export const Step2Text = () => null;

export const Step3Text = () => null;

export const Step4Text = () => (
  <div className="text">
    <p>
      You'll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide:
    </p>
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
