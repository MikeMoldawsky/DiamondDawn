import React, { useEffect, useState } from "react";
import "./NFTs.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokenByIdSelector, tokensSelector } from "store/tokensReducer";
import { safeParseInt } from "utils";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import NFT from "./NFT";
import { useNavigate } from "react-router-dom";
import NFTGallery from "./NFTGallery";
import size from "lodash/size";
import head from "lodash/head";
import values from "lodash/values";
import GoToOpensea from "./GoToOpensea";

const NFTs = () => {
  const tokens = useSelector(tokensSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedTokenId } = useSelector(uiSelector);
  const selectedToken = useSelector(tokenByIdSelector(selectedTokenId));
  const [transitionName, setTransitionName] = useState("");
  const [startTransition, setStartTransition] = useState(false);

  useEffect(() => {
    if (selectedTokenId === -1 && size(tokens) === 1) {
      dispatch(setSelectedTokenId(head(values(tokens)).id));
    }
  }, []);

  const selectToken = (id, transition) => {
    if (transition) {
      setStartTransition(true);
      setTransitionName(transition);
    }
    setTimeout(() => {
      dispatch(setSelectedTokenId(safeParseInt(id)));
      setStartTransition(false);
    }, 350);
  };

  const onChangeNFT = (direction, tokenId) => {
    selectToken(
      tokenId,
      direction === "prev" ? "moveToLeftUnfoldRight" : "moveToRightUnfoldLeft"
    );
  };

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  if (size(tokens) === 0)
    return (
      <div className="box-content opaque nfts">
        <GoToOpensea />
      </div>
    );

  if (selectedToken)
    return (
      <div className="box-content nfts nft">
        <div className="layout-box">
          <NFT
            token={selectedToken}
            hideCertificate={startTransition}
            transitionName={transitionName}
            goToProcess={goToProcess}
            onChangeNFT={onChangeNFT}
          />
        </div>
      </div>
    );

  return (
    <div className="box-content nfts">
      <NFTGallery goToProcess={goToProcess} />
    </div>
  );
};

export default NFTs;
