import React from "react";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import useGoToInvites from "hooks/useGoToInvites";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import classNames from "classnames";
import { isMintOpenSelector, systemSelector } from "store/systemReducer";
import { SYSTEM_STAGE } from "consts";

const CTAButton = ({ className, onClick }) => {
  const collector = useSelector(collectorSelector);
  const goToInvites = useGoToInvites();
  const navigate = useNavigate();
  const canMint = useSelector(isMintOpenSelector);

  const renderButton = ({
    text,
    customCTAClick = () => navigate("/mint"),
    sfx = "action",
  }) => (
    <Button
      className={classNames("gold", className)}
      sfx={sfx}
      onClick={() => {
        customCTAClick();
        onClick && onClick();
      }}
    >
      {text}
    </Button>
  );

  if (!collector) return renderButton({ text: "APPLY FOR DIAMOND DAWN" });

  if (collector.approved) {
    if (collector.minted)
      return renderButton({ text: "COLLECTOR'S ROOM", sfx: "explore" });

    return canMint
      ? renderButton({ text: "MINT NOW" })
      : renderButton({
          text: "INVITE A FRIEND",
          customCTAClick: goToInvites,
        });
  }

  return renderButton({ text: "APPLICATION STATUS", sfx: "explore" });
};

export default CTAButton;
