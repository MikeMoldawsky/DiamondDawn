import React from 'react'
import {useSelector} from "react-redux";
import {collectorSelector} from "store/collectorReducer";
import useGoToInvites from "hooks/useGoToInvites";
import {useNavigate} from "react-router-dom";
import {isActionFirstCompleteSelector} from "store/actionStatusReducer";
import Button from "components/Button";
import classNames from "classnames";

const CTAButton = ({ className }) => {
  const collector = useSelector(collectorSelector);
  const goToInvites = useGoToInvites();
  const navigate = useNavigate();
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );

  if (!isCollectorFetched) return null

  const renderButton = (text, onClick = () => navigate("/collector")) => (
    <Button className={classNames("gold", className)} sfx="action" onClick={onClick}>
      {text}
    </Button>
  )

  if (!collector) return renderButton("APPLY FOR DIAMOND DAWN")


  if (collector.approved) return renderButton("MY INVITATIONS", goToInvites)

  return renderButton("COLLECTOR'S ROOM")
}

export default CTAButton