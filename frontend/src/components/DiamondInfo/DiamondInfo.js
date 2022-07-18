import React, { useRef } from 'react'
import './DiamondInfo.scss'
import Diamond from "components/Diamond";
import { shapeName } from "utils";

const DiamondInfo = ({ diamond }) => {
  const { id, shape, cutable, polishable } = diamond

  return (
    <div className="diamond-info">
      <Diamond diamond={diamond} />
      <div className="text-content">
        <div className="token-id"># {id}</div>
        <div className="center-aligned-row"><span>Shape</span><span>{shapeName(shape)}</span></div>
        <div className="center-aligned-row"><span>Cutable</span><span>{cutable.toString()}</span></div>
        <div className="center-aligned-row"><span>Polishable</span><span>{polishable.toString()}</span></div>
      </div>
    </div>
  )
}

export default DiamondInfo
