import React from "react";
import _ from 'lodash'

const CommonView = ({ leadingText, secondaryText, children }) => {
  const mainTexts = _.isArray(leadingText) ? leadingText : [leadingText]

  return (
    <div className="common-view centered">
      {children}
      <div className="leading-text">{mainTexts.map(text => (<div>{text}</div>))}</div>
      <div className="secondary-text">{secondaryText}</div>
    </div>
  )
}

export default CommonView;
