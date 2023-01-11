import React from "react";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { NFT_NAME_BY_STAGE } from "consts";
import AnimatedLogo from "components/AnimatedLogo";
import Button from "components/Button";
import { OpenseaLink } from "components/Links";

const GoToOpensea = () => {
  const { systemStage, isActive } = useSelector(systemSelector);

  const nextActionableName =
    NFT_NAME_BY_STAGE[isActive ? systemStage : systemStage + 1];

  return (
    <div className="center-aligned-column goto-opensea">
      <div className="logo">
        <AnimatedLogo withText />
      </div>
      <div className="left-centered-aligned-column">
        <div className="subtitle-text">Your Collection is Empty</div>
        <div className="text">
          Don't worry, you can still participate in Diamond Dawn by purchasing a{" "}
          <b>{nextActionableName}</b> NFT in the open market
        </div>
      </div>
      <OpenseaLink>
        <Button sfx="action" className="gold lg">
          GO TO OPENSEA
        </Button>
      </OpenseaLink>
    </div>
  );
};

export default GoToOpensea;
