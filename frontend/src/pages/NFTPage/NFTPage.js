import React, {useEffect} from "react";
import classNames from "classnames";
import './NFTPage.scss'
import {useParams} from "react-router-dom";
import DiamondInfo from "components/DiamondInfo";
import {useSelector} from "react-redux";
import {tokenByIdSelector} from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import {getStageName, getTokenTrait} from "utils";
import {TRAIT} from "consts";
import {uiSelector} from "store/uiReducer";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";

function NFTPage() {

  const { tokenId: tokenIdString } = useParams()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))

  useSelectTokenFromRoute()

  const isActionable = true
  const stageName = getStageName(getTokenTrait(token, TRAIT.stage))

  return token ? (
    <div className={classNames("page nft-page")}>
      <div className="info-container">
        <DiamondInfo diamond={token} />
      </div>
      {isActionable && (
        <div className="center-center-aligned-row actionable">
          <div>Your NFT can be processed</div>
          <NavLink to={`/process/${tokenIdString}`}>
            <div className="button">{stageName}</div>
          </NavLink>
        </div>
      )}
    </div>
  ) : null
}

export default NFTPage;
