import React from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import './DiamondList.scss'
import NFTS_MOCK from "assets/data/nft.mock";
import { SHAPE } from "consts";
import { systemSelector } from "store/systemReducer";

const diamondIconByShape = {
  [SHAPE.ROUND]: faGem,
  [SHAPE.DROP]: faGem,
  [SHAPE.HEART]: faGem,
}

const DiamondItem = ({ diamond }) => {
  const { selectedTokenId } = useSelector(uiSelector)
  const { stage: systemStage, isStageActive } = useSelector(systemSelector)
  const dispatch = useDispatch()

  const { id, stage, shape } = diamond

  const selected = selectedTokenId === id
  const enabled = isStageActive && (stage === systemStage - 1)

  return (
    <div className={classNames("diamond-item", { selected, enabled })} onClick={() => dispatch(setSelectedTokenId(id))}>
      <FontAwesomeIcon icon={diamondIconByShape[shape]} />
      <div className="token-id">#{id}</div>
    </div>
  )
}

const DiamondList = () => (
  <div className="diamond-list">
    {_.map(NFTS_MOCK, diamond => (<DiamondItem diamond={diamond} />))}
  </div>
);

export default DiamondList;
