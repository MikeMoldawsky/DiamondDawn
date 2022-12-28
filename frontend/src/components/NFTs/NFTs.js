import React, {useEffect, useState} from "react";
import size from "lodash/size";
import head from "lodash/head";
import last from "lodash/last";
import "./NFTs.scss";
import { useDispatch, useSelector } from "react-redux";
import {tokenByIdSelector, tokensSelector} from "store/tokensReducer";
import { useNavigate } from "react-router-dom";
import {getCDNImageUrl, getTokenNextStageName, isTokenActionable, safeParseInt} from "utils";
import {setSelectedTokenId, uiSelector} from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import { PageTransition } from "@steveeeie/react-page-transition";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NFTTraits from "./NFTTraits";
import NFTPlate from "./NFTPlate";
import classNames from "classnames";

const NFTs = () => {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedTokenId } = useSelector(uiSelector)
  const selectedToken = useSelector(tokenByIdSelector(selectedTokenId))
  const [transitionName, setTransitionName] = useState("")
  const [startTransition, setStartTransition] = useState(false)

  const tokenCount = size(tokens)
  const tokenIds = Object.keys(tokens).map(safeParseInt)
  const selectedIndex = tokenIds.indexOf(selectedTokenId)
  const firstId = safeParseInt(head(tokenIds))
  const lastId = safeParseInt(last(tokenIds))

  const selectToken = (index, transition) => {
    if (transition) {
      setStartTransition(true)
      setTransitionName(transition)
    }
    setTimeout(() => {
      const id = tokenIds[index]
      dispatch(setSelectedTokenId(safeParseInt(id)))
      setStartTransition(false)
    }, 350)
  }

  useEffect(() => {
    if (selectedTokenId === -1 && tokenCount > 0) {
      dispatch(setSelectedTokenId(firstId))
    }
  }, [selectedTokenId, tokenCount])

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  console.log({ selectedTokenId, firstId, lastId })

  if (!selectedToken) return null

  const showBackButton = selectedTokenId !== firstId
  const showForwardButton = selectedTokenId !== lastId
  const middleBorderClassNames = {
    "with-back-btn": showBackButton,
    "with-forward-btn": showForwardButton,
  }

  return (
    <div className="box-content opaque nfts">
      <div className="layout-box">
        <div className={classNames("border-box top-border-box")} />
        <div className={classNames("border-box middle-border-box", middleBorderClassNames)} />
        <div className={classNames("border-box bottom-border-box")} />
        {showBackButton && (
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
        <div className={classNames("spaced-aligned-column content-box", { hidden: startTransition})}>
          <div className="center-aligned-row card-header">
            <div>
              <div className="subtitle-text">{selectedToken.name}</div>
              <div className="tagline-text">NFT #{selectedToken.id} / 333</div>
            </div>
            <img src={getCDNImageUrl("certificate.svg")} alt="" />
          </div>
          <div>
            <div className="certificate">
              <NFTTraits traits={selectedToken.attributes} />
            </div>
            <NFTPlate />
          </div>
        </div>
        {showForwardButton && (
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
  )
};

export default NFTs;
