import React, {useEffect} from "react";
import classNames from "classnames";
import './NFTPage.scss'
import {useParams} from "react-router-dom";
import DiamondInfo from "components/DiamondInfo";
import {useSelector} from "react-redux";
import {tokenByIdSelector} from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import {getTokenNextStageName, isTokenActionable, isTokenDone} from "utils";
import {uiSelector} from "store/uiReducer";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";
import {systemSelector} from "store/systemReducer";

function NFTPage() {

  const { tokenId: tokenIdString } = useParams()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { stage } = useSelector(systemSelector)

  useSelectTokenFromRoute()

  if (!token) return null

  const renderByStatusPart = () => {
    if (isTokenDone(token, stage)) return (
      <>
        <div className="leading-text">This is Your Final Diamond NFT</div>
        <div className="info-container">
          <DiamondInfo diamond={token} />
        </div>
      </>
    )
    if (isTokenActionable(token, stage)) {
      const actionName = getTokenNextStageName(token)
      return (
        <>
          <div className="info-container">
            <DiamondInfo diamond={token} />
          </div>
          <div className="center-center-aligned-row actionable">
            <div>Your NFT can be processed</div>
            {actionName === 'REBIRTH' ? (
              <div className="button disabled">{actionName}</div>
            ) : (
              <NavLink to={`/process/${tokenIdString}`}>
                <div className="button">{actionName}</div>
              </NavLink>
            )}
          </div>
        </>
      )
    }
    return (
      <div className="info-container">
        <DiamondInfo diamond={token} />
      </div>
    )
  }

  return (
    <div className={classNames("page nft-page")}>
      {renderByStatusPart()}
    </div>
  )
}

export default NFTPage;
