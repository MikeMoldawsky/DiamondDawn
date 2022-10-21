import React from "react";
import "./EnterMine.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import isFunction from "lodash/isFunction";
import { utils as ethersUtils } from "ethers";

const EnterMineView = ({
  minePrice = 3.33,
  maxDiamonds = 333,
  diamondCount = 0,
  canMint,
  enterMine,
  expiresAt,
  onCountdownEnd,
}) => {
  return (
    <div className="action-view enter">
      <div className="layout-box">
        <div className="image-box" />
        <div className="congrats-box">
          <div className="center-aligned-column">
            <div className="leading-text">CONGRATULATION</div>
            <div className="secondary-text">
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since
            </div>
          </div>
        </div>
        <div className="mint-box">
          <div className="center-aligned-row">
            <div className="center-start-aligned-row text-row">
              <FontAwesomeIcon icon={faEthereum} />
              <div className="price">
                {ethersUtils.formatUnits(minePrice)} GET YOUR KEY
              </div>
            </div>
            <div>
              <ActionButton
                actionKey="EnterMine"
                className="action-button"
                disabled={!canMint || !isFunction(enterMine)}
                onClick={() => isFunction(enterMine) && enterMine()}
              >
                MINT
              </ActionButton>
            </div>
          </div>
        </div>
        <div className="timer-box">
          <div className="text-comment">
            The offer will close when the clock runs out
          </div>
          <Countdown
            parts={
              expiresAt ? null : { days: 3, hours: 3, minutes: 3, seconds: 0 }
            }
            date={expiresAt}
            onComplete={() => isFunction(onCountdownEnd) && onCountdownEnd()}
            renderParts={{
              days: true,
              hours: true,
              minutes: true,
              seconds: true,
            }}
          />
          <div className="or">OR</div>
        </div>
        <div className="status-box">
          LIMITED OFFER OF {maxDiamonds} NFTS<span>/</span>
          {maxDiamonds - diamondCount} REMAINING
        </div>
      </div>
    </div>
  );
};

export default EnterMineView;
