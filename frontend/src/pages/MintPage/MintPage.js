import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Join from "components/Join";
import { collectorSelector } from "store/collectorReducer";
import CollectorLoader from "containers/CollectorLoader";
import { useNavigate } from "react-router-dom";
import MintKey from "components/MintKey";
import { inviteSelector } from "store/inviteReducer";
import CollectorLayout from "pages/layouts/CollectorLayout";
import {isNoContractMode} from "utils";

const MintView = ({ isHonorary }) => {
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);
  const navigate = useNavigate();
  const inviteOrCollectorHonorary =
    collector?.honorary || invite?.honoraryInvitee;

  useEffect(() => {
    console.log("MintPage useEffect", collector);
    if (isNoContractMode()) return navigate("/")
    if (collector?.mintedAll) return navigate("/collector");

    if (
      !isHonorary &&
      inviteOrCollectorHonorary &&
      !collector?.mintedHonorary
    ) {
      return navigate("/mint-honorary");
    }
    if (
      isHonorary &&
      (!inviteOrCollectorHonorary || collector?.mintedHonorary)
    ) {
      return navigate("/mint");
    }
  }, [
    isHonorary,
    inviteOrCollectorHonorary,
    collector?.mintedAll,
    collector?.mintedHonorary,
  ]);

  if (collector?.approved)
    return (
      <div className="box-content approved">
        <MintKey isHonorary={isHonorary} />
      </div>
    );

  return <Join />;
};

const MintPage = ({ isHonorary }) => {
  const collector = useSelector(collectorSelector);

  return (
    <CollectorLayout collectorLoader={!!collector} waitForTokens>
      <CollectorLoader />
      <MintView isHonorary={isHonorary} />
    </CollectorLayout>
  );
};

export default MintPage;
