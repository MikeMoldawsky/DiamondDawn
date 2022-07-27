import React from 'react'
import './DiamondInfo.scss'
import Diamond from "components/Diamond";
import _ from 'lodash'

const DiamondInfo = ({ diamond }) => {
  const { id, attributes } = diamond

  return (
    <div className="diamond-info">
      <Diamond diamond={diamond} />
      <div className="text-content">
        <div className="token-id"># {id}</div>
        {_.map(attributes, ({ trait_type, value }) => (
          <div key={`trait-${_.kebabCase(trait_type)}`} className="center-aligned-row"><span>{trait_type}</span><span>{value}</span></div>
        ))}
      </div>
    </div>
  )
}

export default DiamondInfo
