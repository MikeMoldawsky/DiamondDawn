import React, {useEffect, useState} from "react";
import map from "lodash/map";
import size from "lodash/size";
import head from "lodash/head";
import last from "lodash/last";
import padStart from "lodash/padStart";
import filter from "lodash/filter";
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
import DiamondInfo from "components/DiamondInfo";
import NFTTraits from "components/NFTs/NFTTraits";
import {NFT_NAME_BY_STAGE, SYSTEM_STAGE, SYSTEM_STAGE_NAME} from "consts";

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
  const firstId = safeParseInt(head(tokenIds))
  const lastId = safeParseInt(last(tokenIds))

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
      dispatch(setSelectedTokenId(firstId))
    }
  }, [selectedTokenId, tokenCount])

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  const renderPlateEntry = (stage, name) => {
    console.log({ stage, name })
    switch (stage) {
      case SYSTEM_STAGE.KEY:
        return (
          <>
            <div>{name}</div>
            <div># {padStart(selectedTokenId, 3, '0')} / 333</div>
          </>
        )
      case SYSTEM_STAGE.DAWN:
        return (
          <>
            <div>{name}</div>
            <div># 000 / 333</div>
          </>
        )
      default:
        return <div className="unrevealed">?</div>
    }
  }

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
            <div className="nft-plate">
              <div className="bg">
                <div className="nail"/>
                <div className="nail"/>
                <div className="nail"/>
                <div className="nail"/>
              </div>
              <div className="center-aligned-row phases">
                {map(NFT_NAME_BY_STAGE, (name, stage) => (
                  <div key={`plate-phase-${stage}`} className="center-aligned-column phase-info">
                    <div className="left-centered-aligned-column">
                      {renderPlateEntry(parseInt(stage), name)}
                    </div>
                  </div>
                ))}
              </div>
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
