import React from "react";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import useGoToInvites from "hooks/useGoToInvites";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import classNames from "classnames";
import useCanAccessDD from "hooks/useCanAccessDD";

const CTAButton = ({ className, onClick }) => {
  const collector = useSelector(collectorSelector);
  const goToInvites = useGoToInvites();
  const navigate = useNavigate();
  const canAccessDD = useCanAccessDD()

  const renderButton = ({
    text,
    customCTAClick = () => navigate("/mint"),
    sfx = "explore",
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

  if (!canAccessDD) return null;

  if (!collector?.minted)
    return renderButton({ text: "MINT NOW" });

  return renderButton({ text: "INVITE A FRIEND", customCTAClick: goToInvites });
};

export default CTAButton;
