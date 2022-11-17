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

  if (!collector) return (
    <Button className={classNames("gold", className)} onClick={() => navigate("/collector")}>
      APPLY FOR DIAMOND DAWN
    </Button>
  )

  if (collector.approved) return (
    <Button className={classNames("gold", className)} onClick={goToInvites}>
      MY INVITATIONS
    </Button>
  )

  return null
}

export default CTAButton