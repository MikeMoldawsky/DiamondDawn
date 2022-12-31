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
        Keep your diamond NFT digital or burn it in exchange for a physical,
        GIA-certified diamond that is set as part of a luxurious 8kg (17.6 lb)
        artwork that will be delivered to your doorstep.
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
      Throughout this historical journey, you’ll take part in the creation of
      the <b>first diamonds</b> to be entirely crafted and materialized on the
      blockchain, and learn about the hidden world of the diamond industry.
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
      You own a perfect digital diamond (NFT) designed by David Ariew with all
      of its GIA attributes. <br /> Now, you'll need to decide what's more
      valuable, the physical or digital.
      <br />
      You can keep your diamond in its digital form forever or transform it into
      a physical GIA-certified diamond that will be set as part of a luxurious
      8kg artwork delivered to your doorstep.
      <br />
      These artworks are made with the first diamonds to be entirely crafted and
      recorded on the blockchain.
      <br />
      You'll have exactly <b>3 months, 3 weeks, and 3 days</b> to decide.
    </p>
  </div>
);
