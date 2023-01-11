import React from "react";
import { useSelector } from "react-redux";
import {
  createVideoSources,
  getTokenNextStageName,
  isTokenActionable,
} from "utils";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import { PageTransition } from "@steveeeie/react-page-transition";
import NFTTraits from "./NFTTraits";
import NFTPlate from "./NFTPlate";
import classNames from "classnames";
import CarouselBox from "components/CarouselBox";
import { tokensSelector } from "store/tokensReducer";
import { uiSelector } from "store/uiReducer";
import InlineVideo from "components/VideoPlayer/InlineVideo";

const NFT = ({
  token,
  hideCertificate,
  transitionName,
  goToProcess,
  onChangeNFT,
}) => {
  const { systemStage, isActive } = useSelector(systemSelector);
  const tokens = useSelector(tokensSelector);
  const { selectedTokenId } = useSelector(uiSelector);

  return (
    <>
      <div className="diamond-box">
        <CarouselBox
          items={tokens}
          activeItemId={selectedTokenId}
          onChange={onChangeNFT}
        >
          <PageTransition
            preset={transitionName}
            transitionKey={`token-${token.id}`}
          >
            <Diamond diamond={token} withSound />
          </PageTransition>
        </CarouselBox>
      </div>
      <div
        className={classNames("spaced-aligned-column content-box", {
          hidden: hideCertificate,
        })}
      >
        <div>
          <div className="top-spaced-row card-header">
            <div>
              <div className="subtitle-text">{token.name}</div>
              <div className="tagline-text">NFT #{token.id} / 333</div>
            </div>
            <InlineVideo src={createVideoSources("nft-certification")} />
          </div>
          <div className="certificate">
            <NFTTraits traits={token.attributes} />
          </div>
        </div>
        <NFTPlate />
      </div>
      {isTokenActionable(token, systemStage, isActive) && (
        <div className="button" onClick={goToProcess(token.id)}>
          {getTokenNextStageName(token)}
        </div>
      )}
    </>
  );
};

export default NFT;
