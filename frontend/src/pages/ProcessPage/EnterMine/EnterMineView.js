import React from "react";
import "./EnterMine.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import isFunction from "lodash/isFunction";
import { BigNumber, utils as ethersUtils } from "ethers";

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
            <div className="leading-text">CONGRATULATIONS!</div>
            <div className="secondary-text">
              <div>You have been selected to participate in Diamond Dawn.</div>
              During your journey, you will decide when to proceed and when to
              stop. At the end, you will be faced with the ultimate choice:
              Which form of exquisite diamond art you value more, the virtual or
              the tangible.
            </div>
          </div>
        </div>
        <div className="mint-box">
          <div className="center-aligned-row">
            <div className="center-start-aligned-row text-row">
              <FontAwesomeIcon icon={faEthereum} />
              <div className="price">
                {BigNumber.isBigNumber(minePrice)
                  ? ethersUtils.formatUnits(minePrice)
                  : "N/A"}{" "}
                ACTIVATE YOUR KEY
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
            The opportunity will close once the clock runs out
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
          {diamondCount} / {maxDiamonds} ALREADY MINTED
        </div>
      </div>
    </div>
  );
};

export default EnterMineView;
