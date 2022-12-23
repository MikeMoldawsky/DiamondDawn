import React, {useEffect, useState} from "react";
import map from "lodash/map";
import size from "lodash/size";
import head from "lodash/head";
import last from "lodash/last";
import "./NFTs.scss";
import { useDispatch, useSelector } from "react-redux";
import {tokenByIdSelector, tokensSelector} from "store/tokensReducer";
import { useNavigate } from "react-router-dom";
import {getCDNImageUrl, getTokenNextStageName, isTokenActionable} from "utils";
import {setSelectedTokenId, uiSelector} from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import { PageTransition } from "@steveeeie/react-page-transition";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DiamondInfo from "components/DiamondInfo";
import NFTTraits from "components/NFTs/NFTTraits";

const NFTs = () => {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedTokenId } = useSelector(uiSelector)
  const selectedToken = useSelector(tokenByIdSelector(selectedTokenId))
  const [transitionName, setTransitionName] = useState("")

  const tokenCount = size(tokens)
  const tokenIds = Object.keys(tokens)
  const selectedIndex = tokenIds.indexOf(selectedTokenId)
  const firstId = head(tokenIds)
  const lastId = last(tokenIds)

  const selectToken = (index, transition) => {
    if (transition) {
      setTransitionName(transition)
    }
    setTimeout(() => {
      const id = tokenIds[index]
      dispatch(setSelectedTokenId(id))
    }, 0)
  }

  useEffect(() => {
    if (selectedTokenId === -1 && tokenCount > 0) {
      selectToken(firstId)
    }
  }, [selectedTokenId, tokenCount])

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  return selectedToken ? (
    <div className="box-content opaque nfts">
      <div className="layout-box">
        {selectedTokenId !== firstId && (
          <div className="box-button back" onClick={() => selectToken(selectedIndex - 1, "moveToLeftUnfoldRight")}>
            <ArrowBackIosNewIcon />
          </div>
        )}
        <div className="diamond-box">
          <PageTransition
            preset={transitionName}
            transitionKey={`token-${selectedTokenId}`}
          >
            <Diamond diamond={selectedToken} />
          </PageTransition>
        </div>
        <div className="spaced-aligned-column content-box">
          <div className="center-aligned-row card-header">
            <div>
              <div className="subtitle-text">{selectedToken.name}</div>
              <div className="tagline-text">NFT #{selectedToken.id} / 333</div>
            </div>
            <img
              // className="certificate"
              src={getCDNImageUrl("certificate.svg")}
              alt=""
            />
          </div>
          <div>
            <div className="certificate">
              <NFTTraits traits={selectedToken.attributes} />
            </div>
            <div className="ids-plate">

            </div>
          </div>
        </div>
        {selectedTokenId !== lastId && (
          <div className="box-button forward" onClick={() => selectToken(selectedIndex + 1, "moveToRightUnfoldLeft")}>
            <ArrowForwardIosIcon />
          </div>
        )}
      </div>
      {isTokenActionable(selectedToken, systemStage, isActive) && (
        <div className="button" onClick={goToProcess(selectedToken.id)}>
          {getTokenNextStageName(selectedToken)}
        </div>
      )}
    </div>
  ) : null;
};

export default NFTs;
