import React from "react";
import classNames from "classnames";
import './NFTPage.scss'
import { useParams } from "react-router-dom";
import DiamondInfo from "components/DiamondInfo";
import {useSelector} from "react-redux";
import {tokenByIdSelector} from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import {getStageName, getTokenTrait} from "utils";
import {TRAIT} from "consts";

function NFTPage() {

  const { tokenId } = useParams()
  const token = useSelector(tokenByIdSelector(tokenId))

  const isActionable = true
  const stageName = getStageName(getTokenTrait(token, TRAIT.stage))

  return (
    <div className={classNames("page nft-page")}>
      <div className="info-container">
        <DiamondInfo diamond={token} />
      </div>
      {isActionable && (
        <div className="center-center-aligned-row actionable">
          <div>Your NFT can be processed</div>
          <NavLink to={`/process/${tokenId}`}>
            <div className="button">{stageName}</div>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default NFTPage;
