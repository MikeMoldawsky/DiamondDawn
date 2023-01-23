import React from "react";
import CTAButton from "components/CTAButton";

export const PhaseKeyText = () => (
  <div className="text">
    <p>
      The key grants you <b>full access</b> to the 5 phases of DD's journey,
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

export const PhaseRoughStoneText = () => {
  return (
    <div className="text">
      <p>Diamond Dawn's mine will open soon.</p>
    </div>
  );
};

export const PhaseToBeRevealedText = () => (
  <div className="text">
    <p>To be revealed.</p>
  </div>
);

export const PhaseFinalText = () => (
  <div className="text">
    <p>To be revealed.</p>
  </div>
);
