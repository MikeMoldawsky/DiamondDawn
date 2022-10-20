import React from "react";
import "./EnterMine.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import useNavigateToDefault from "hooks/useNavigateToDefault";

const EnterMine = ({ invite }) => {
  const minePrice = 3.33
  const maxDiamonds = 333
  const diamondCount = 0
  const navigateToDefault = useNavigateToDefault();

  const onInviteExpired = () => navigateToDefault();

  return (
    <div className="action-view enter">
      <div className="layout-box">
        <div className="image-box" />
        <div className="congrats-box">
          <div className="leading-text">CONGRATULATION</div>
          <div className="secondary-text">
            simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since
          </div>
        </div>
        <div className="mint-box center-aligned-row">
          <div className="price">
            {minePrice} GET YOUR KEY
          </div>
          <ActionButton
            actionKey="EnterMine"
            className="action-button"
            disabled
          >
            MINT
          </ActionButton>
        </div>
        <div className="timer-box">
          <div className="text-comment">
            The offer will close when the clock runs out
          </div>
          <Countdown
            parts={{ days: 3, hours: 3, minutes: 3 }}
            text={["Invite Expires in"]}
            onComplete={onInviteExpired}
            renderParts={{
              days: true,
              hours: true,
              minutes: true,
              seconds: true,
            }}
          />
        </div>
        <div className="status-box">
          LIMITED OFFER OF {maxDiamonds} NFTS / {maxDiamonds - diamondCount} REMAINING
        </div>
      </div>
    </div>
  );
};

export default EnterMine;
