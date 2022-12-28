import React from "react";
import { useSelector } from "react-redux";
import {getCDNImageUrl, getTokenNextStageName, isTokenActionable} from "utils";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import { PageTransition } from "@steveeeie/react-page-transition";
import NFTTraits from "./NFTTraits";
import NFTPlate from "./NFTPlate";
import classNames from "classnames";

const NFT = ({ token, hideCertificate, transitionName, goToProcess }) => {
  const { systemStage, isActive } = useSelector(systemSelector);

  return (
    <>
      <div className="diamond-box">
        <PageTransition
          preset={transitionName}
          transitionKey={`token-${token.id}`}
        >
          <Diamond diamond={token} />
        </PageTransition>
      </div>
      <div className={classNames("spaced-aligned-column content-box", { hidden: hideCertificate})}>
        <div className="center-aligned-row card-header">
          <div>
            <div className="subtitle-text">{token.name}</div>
            <div className="tagline-text">NFT #{token.id} / 333</div>
          </div>
          <img src={getCDNImageUrl("certificate.svg")} alt="" />
        </div>
        <div>
          <div className="certificate">
            <NFTTraits traits={token.attributes} />
          </div>
          <NFTPlate />
        </div>
      </div>
      {isTokenActionable(token, systemStage, isActive) && (
        <div className="button" onClick={goToProcess(token.id)}>
          {getTokenNextStageName(token)}
        </div>
      )}
    </>
  )
};

export default NFT;
