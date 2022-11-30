import React from "react";
import { useSelector } from "react-redux";
import { collectorSelector } from "store/collectorReducer";
import useGoToInvites from "hooks/useGoToInvites";
import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import classNames from "classnames";

const CTAButton = ({ className }) => {
  const collector = useSelector(collectorSelector);
  const goToInvites = useGoToInvites();
  const navigate = useNavigate();

  const renderButton = ({
    text,
    onClick = () => navigate("/collector"),
    sfx = "action",
  }) => (
    <Button
      className={classNames("gold", className)}
      sfx={sfx}
      onClick={onClick}
    >
      {text}
    </Button>
  );

  if (!collector) return renderButton({ text: "APPLY FOR DIAMOND DAWN" });

  if (collector.approved)
    return renderButton({ text: "INVITE A FRIEND", onClick: goToInvites });

  return renderButton({ text: "APPLICATION STATUS", sfx: "explore" });
};

export default CTAButton;
