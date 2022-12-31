import React from "react";
import CTAButton from "components/CTAButton";

export const TheJourneyMainText = () => (
  <>
    <div className="text">
      <p>
        Diamond Dawn is a 6-month art NFT project featuring 333 limited edition
        NFTs, each of which is paired with a real diamond. These 333 natural
        diamonds add an extra level of value and rarity to the project.
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
      <div className="tagline-text">Which diamond will you choose?</div>
    </div>
    <div className="text">
      <p>
        The fourth and final phase is longer. You’ll have exactly{" "}
        <b>3 months, 3 weeks, and 3 days</b> to decide on your Final Choice:
      </p>
      <p>
        Keep your diamond NFT digital or burn it in exchange for a physical, 8
        kg (17.6 lb) limited-edition art piece that contains your GIA-certified
        diamond.
      </p>
      <p>
        Once your decision is finalized on the blockchain, your physical art
        piece will be <b>shipped</b> to your specified address.
      </p>
    </div>
  </>
);

export const TheJourneyText = () => (
  <div className="text">
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
      The key grants you <b>full access</b> to the 4 phases of DD's journey,
      starting in the virtual mine, where your journey begins.
    </p>
    <p>
      The application phase will automatically end when 333 participants minted
      their keys.
    </p>
    <p className="cta-row">
      <CTAButton />
    </p>
  </div>
);

export const Phase1Text = () => {
  return (
    <div className="text">
      <p>Diamond Dawn's mine will open soon.</p>
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
