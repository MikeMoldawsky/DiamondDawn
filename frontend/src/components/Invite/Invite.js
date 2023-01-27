import React, { useState } from "react";
import "./Invite.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { useAccount } from "wagmi";
import { clearInvite } from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import MintKey from "components/MintKey";
import {
  collectorSelector,
  loadCollectorByAddress,
} from "store/collectorReducer";
import PendingApproval from "./PendingApproval";
import Apply from "./Apply";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";

const Invite = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const collector = useSelector(collectorSelector);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [playSparklesSFX] = useSound(sparklesSFX);

  if (
    systemStage > SYSTEM_STAGE.KEY ||
    collector?.minted
    // || collector?.mintClosed
  )
    return null;

  const onSubmitSuccess = (address) => {
    dispatch(loadCollectorByAddress(address));
    playSparklesSFX();
    setShowSubmittedModal(true);
    dispatch(clearInvite());
  };

  if (collector?.approved)
    return (
      <div className="box-content approved">
        <MintKey />
      </div>
    );

  if (collector || showSubmittedModal)
    return <PendingApproval showModal={showSubmittedModal} />;

  return <Apply onSubmitSuccess={onSubmitSuccess} />;
};

export default Invite;
