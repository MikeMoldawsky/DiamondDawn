import React, {useEffect} from "react";
import classNames from "classnames";
import './NFTPage.scss'
import {useNavigate, useParams} from "react-router-dom";
import DiamondInfo from "components/DiamondInfo";
import {useDispatch, useSelector} from "react-redux";
import {tokenByIdSelector, tokensSelector} from "store/tokensReducer";
import { NavLink } from "react-router-dom";
import {getStageName, getTokenTrait} from "utils";
import {TRAIT} from "consts";
import _ from "lodash";
import {setSelectedTokenId, uiSelector} from "store/uiReducer";

function NFTPage() {

  const { tokenId: tokenIdString } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))

  useEffect(() => {
    if (_.size(tokens) > 0) {
      if (!_.isEmpty(tokenIdString)) {
        const tokenId = parseInt(tokenIdString)
        if (!_.has(tokens, tokenId)) {
          return navigate('/process')
        }
        dispatch(setSelectedTokenId(tokenId))
      }
      else {
        return navigate('/process')
      }
    }
  }, [tokens, tokenIdString, dispatch])

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
