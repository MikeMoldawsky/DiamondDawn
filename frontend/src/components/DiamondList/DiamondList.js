import React, { useRef, useState } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import './DiamondList.scss'
import { STAGE, SHAPE, TRAIT, NFT_TYPE } from "consts";
import { systemSelector } from "store/systemReducer";
import { tokensSelector } from "store/tokensReducer";
import DiamondInfo from "components/DiamondInfo";
import useOnClickOutside from "hooks/useClickOutside";
import {getTokenTrait} from "utils";
import { NavLink } from "react-router-dom";
import Diamond from "components/Diamond";

const getDiamondIcon = (token) => {
  const type = getTokenTrait(token, TRAIT.type)
  const shapeName = getTokenTrait(token, TRAIT.shape)
  const shape = SHAPE[_.toUpper(shapeName)]

  switch (type) {
    case NFT_TYPE.Rough:
      // rough diamond
      return faGem
    case NFT_TYPE.Cut:
      // cut diamond by shape
      switch (shape) {
        case SHAPE.OVAL:
          return faGem
        case SHAPE.RADIANT:
          return faGem
        case SHAPE.PEAR:
          return faGem
        default:
          return null
      }
    case NFT_TYPE.Polished:
      // polished diamond by shape
      switch (shape) {
        case SHAPE.OVAL:
          return faGem
        case SHAPE.RADIANT:
          return faGem
        case SHAPE.PEAR:
          return faGem
        default:
          return null
      }
    case NFT_TYPE.Burned:
      return faGem
    case NFT_TYPE.Reborn:
      return faGem
    default:
      return null
  }
}

const DiamondItem = ({ diamond }) => {
  const { selectedTokenId } = useSelector(uiSelector)
  const { stage: systemStage, isStageActive } = useSelector(systemSelector)
  const [showInfo, setShowInfo] = useState(false)
  const dispatch = useDispatch()
  const ref = useRef(null)

  useOnClickOutside(ref, () => setShowInfo(false))

  const { id, stage } = diamond

  const selected = selectedTokenId === id
  const enabled = isStageActive && (stage === systemStage - 1)

  return (
    <NavLink to={`/nft/${id}`}>
      <div ref={ref} className={classNames("diamond-item", { selected, enabled })}
           onMouseEnter={() => setShowInfo(true)}
           onMouseLeave={() => setShowInfo(false)}
           onClick={() => enabled && id !== selectedTokenId ? dispatch(setSelectedTokenId(id)) : setShowInfo(!showInfo)}>
        <div className="token-icon">
          <FontAwesomeIcon icon={getDiamondIcon(diamond)} />
          <div className="token-id">#{id}</div>
        </div>
        {showInfo && (
          <div className="diamond-info-container">
            <Diamond diamond={diamond} />
          </div>
        )}
      </div>
    </NavLink>
  )
}

const DiamondList = () => {
  const accountTokens = useSelector(tokensSelector)
  return (
    <div className="diamond-list">
      {_.map(accountTokens, diamond => (<DiamondItem key={`diamond-list-item-${diamond.id}`} diamond={diamond} />))}
    </div>
  );
}

export default DiamondList;
