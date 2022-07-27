import React, { useRef } from 'react'
import './DiamondInfo.scss'
import Diamond from "components/Diamond";
import { getShapeName } from "utils";

const DiamondInfo = ({ diamond }) => {
  const { id, shape } = diamond

  return (
    <div className="diamond-info">
      <Diamond diamond={diamond} />
      <div className="text-content">
        <div className="token-id"># {id}</div>
        <div className="center-aligned-row"><span>Shape</span><span>{getShapeName(shape)}</span></div>
      </div>
    </div>
  )
}

export default DiamondInfo
