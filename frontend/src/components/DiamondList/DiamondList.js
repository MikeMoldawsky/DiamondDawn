import React from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import './DiamondList.scss'
import { STAGE, SHAPE } from "consts";
import { systemSelector } from "store/systemReducer";
import { tokensSelector } from "store/tokensReducer";

const getDiamondIcon = ({ stage, shape }) => {
  switch (stage) {
    case STAGE.MINE:
      // rough diamond
      return faGem
    case STAGE.CUT:
      // cut diamond by shape
      switch (shape) {
        case SHAPE.OVAL:
          return faGem
        case SHAPE.RADIANT:
          return faGem
        case SHAPE.PEAR:
          return faGem
      }
      break
    case STAGE.POLISH:
      // polished diamond by shape
      switch (shape) {
        case SHAPE.OVAL:
          return faGem
        case SHAPE.RADIANT:
          return faGem
        case SHAPE.PEAR:
          return faGem
      }
      break
  }

  return null
}

const DiamondItem = ({ diamond }) => {
  const { selectedTokenId } = useSelector(uiSelector)
  const { stage: systemStage, isStageActive } = useSelector(systemSelector)
  const dispatch = useDispatch()

  const { id, stage, shape } = diamond

  const selected = selectedTokenId === id
  const enabled = isStageActive && (stage === systemStage - 1)

  return (
    <div className={classNames("diamond-item", { selected, enabled })} onClick={() => enabled && dispatch(setSelectedTokenId(id))}>
      <FontAwesomeIcon icon={getDiamondIcon(diamond)} />
      <div className="token-id">#{id}</div>
    </div>
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
