import React, {useState} from "react";
import "./EnterMine.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import isFunction from "lodash/isFunction";
import { BigNumber, utils as ethersUtils } from "ethers";
import InvitationsStatus from "components/InvitationsStatus";
import {useDispatch, useSelector} from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import {collectorSelector, generateInvitations} from "store/collectorReducer";

const EnterMineView = ({
  minePrice = 3.33,
  maxDiamonds = 333,
  diamondCount = 0,
  canMint,
  enterMine,
  expiresAt,
  onCountdownEnd,
}) => {
  const [showInvites, setShowInvites] = useState(false)
  const actionDispatch = useActionDispatch()
  const collector = useSelector(collectorSelector)

  const onInviteClick = () => {
    actionDispatch(generateInvitations(collector._id), "generate-invitations")
    setShowInvites(true)
  }

  return (
    <div className="action-view enter">
      <div className="layout-box">
        <div className="image-box" />
        <div className="content-box">
          {showInvites ? (
            <InvitationsStatus />
          ) : (
            <>
              <div className="congrats-box">
                <div className="center-aligned-column">
                  <div className="leading-text">CONGRATULATIONS</div>
                  <div className="congrats-text">
                    You’ve been accepted to participate in Diamond Dawn’s historical
                    journey.
                    <br />
                    The key grants you <b>full access</b> to the 4 steps of DD's
                    journey, starting in the virtual mine, where your journey
                    begins.
                  </div>
                </div>
              </div>
              <div className="center-aligned-row mint-box">
                <div className="center-start-aligned-row price-text">
                  <FontAwesomeIcon icon={faEthereum} />
                  <div className="price">
                    {BigNumber.isBigNumber(minePrice)
                      ? ethersUtils.formatUnits(minePrice)
                      : "3.33"}{" "}
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
                  When the time runs out, you'll no longer be able to join Diamond
                  Dawn's journey.
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
                <div className="text-sm">You’ve been granted 2 invitations.</div>
                <div className="button gold" onClick={onInviteClick}>INVITE</div>
              </div>
              <div className="status-box">
                {diamondCount} / {maxDiamonds} MINTED
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterMineView;
