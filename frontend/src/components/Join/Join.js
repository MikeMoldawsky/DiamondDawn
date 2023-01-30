import React, {useState} from "react";
import "./Join.scss";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import {clearInvite} from "store/inviteReducer";
import {
  collectorSelector,
  setCollector,
} from "store/collectorReducer";
import PendingApproval from "./PendingApproval";
import RequestToJoin from "components/Join/RequestToJoin";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";

const Join = () => {
  const dispatch = useDispatch();
  const collector = useSelector(collectorSelector);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [playSparklesSFX] = useSound(sparklesSFX);

  const onSubmitSuccess = (collector) => {
    dispatch(setCollector(collector))
    playSparklesSFX();
    if (!collector.approved) {
      setShowSubmittedModal(true);
    }
    dispatch(clearInvite());
  };

  if (collector || showSubmittedModal)
    return <PendingApproval showModal={showSubmittedModal} />;

  return <RequestToJoin onSubmitSuccess={onSubmitSuccess} />;
};

export default Join;
