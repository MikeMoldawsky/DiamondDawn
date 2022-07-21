import React from "react";
import Countdown from 'components/Countdown';

const NoDiamondView = ({ stageName, secondaryText }) => {
  const _secondaryText = secondaryText || `You do not hold a diamond to ${stageName}, you can buy one on OpenSea`
  return (
    <div className="go-to-opensea-view">
      <div className="leading-text">DIAMOND NOT FOUND</div>
      <div className="secondary-text">{_secondaryText}</div>
      <div className="button action-button">Buy a Diamond</div>
      <Countdown date={Date.now() + 10000} text={['You have', `to ${stageName}`]} />
    </div>
  )
}

export default NoDiamondView;
