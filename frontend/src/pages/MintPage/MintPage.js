import React, {useEffect} from "react";
import classNames from "classnames";
import "./MintPage.scss";
import { useSelector } from "react-redux";
import { useAccount, useEnsName } from "wagmi";
import Box from "components/Box";
import Join from "components/Join";
import { getCDNImageUrl, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useNoScrollView from "hooks/useNoScrollView";
import { collectorSelector } from "store/collectorReducer";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import CollectorLoader from "containers/CollectorLoader";
import { useNavigate } from "react-router-dom"
import MintKey from "components/MintKey";
import {inviteSelector} from "store/inviteReducer";

export const MintView = ({ isHonorary }) => {
  const isMobile = useMobileOrTablet();
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const collector = useSelector(collectorSelector);
  const invite = useSelector(inviteSelector);
  const navigate = useNavigate()
  const inviteOrCollectorHonorary = collector?.honorary || invite?.honoraryInvitee

  useNoScrollView(isMobile);

  useMusic("collector.mp3");

  useEffect(() => {
    if (!isHonorary && inviteOrCollectorHonorary && !collector?.mintedHonorary) {
      navigate("/mint-honorary")
    }
  }, [isHonorary, inviteOrCollectorHonorary])

  const renderContent = () => {
    if (collector?.approved) return (
      <div className="box-content approved">
        <MintKey isHonorary={isHonorary} />
      </div>
    );

    return <Join />;
  };

  return (
    <div className={classNames("page mint-page")}>
      <div className="bg collector-bg" />
      <div className="inner-page">
        <h1>The Collector's Room</h1>
        <div className="center-center-aligned-row account">
          {ensName?.data || shortenEthAddress(account?.address)}
        </div>
        <Box className="main-box">
          <CollectorLoader />
          {renderContent()}
        </Box>
      </div>
    </div>
  );
};

const MintPage = ({ isHonorary }) => {
  const collector = useSelector(collectorSelector);

  return (
    <Page
      pageName="collector"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      collectorLoader={!!collector}
    >
      <MintView isHonorary={isHonorary} />
    </Page>
  )
}

export default MintPage;
