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
        <div className="content-box">
          <div className="congrats-box">
            <div className="center-aligned-column">
              <div className="leading-text">CONGRATULATIONS</div>
              <div className="congrats-text">
                You’ve been accepted to participate in Diamond Dawn’s historical journey.
                <br/>
                {/*In order to allow other participants to join, you’ll have exactly <b>3 days, 3 hours, and 3 minutes</b> to activate your key.*/}
                {/*<br/>*/}
                The key grants you <b>full access</b> to the 4 steps of DD's journey, starting in the virtual mine, where your journey begins.
              </div>
            </div>
          </div>
          <div className="center-aligned-row mint-box">
            <div className="center-start-aligned-row price-text">
              <FontAwesomeIcon icon={faEthereum} />
              <div className="price">
                {BigNumber.isBigNumber(minePrice)
                  ? ethersUtils.formatUnits(minePrice)
                  : ""}{" "}
                ACTIVATE YOUR KEY
              </div>
            </div>
            <div>
              <ActionButton
                actionKey="EnterMine"
                className="action-button lg"
                disabled={!canMint || !isFunction(enterMine)}
                onClick={() => isFunction(enterMine) && enterMine()}
              >
                MINT
              </ActionButton>
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
          </div>
          <div className="center-aligned-row invites-box">
            <div className="keys-image">
              <div className="key" />
              <div className="key" />
            </div>
            <div className="text-sm">Now that you’re accepted you can share 2 unique links and invite other collectors to the private sale</div>
            <div className="button gold">INVITE</div>
          </div>
          <div className="status-box">
            {diamondCount} / {maxDiamonds} MINTED
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterMineView;
