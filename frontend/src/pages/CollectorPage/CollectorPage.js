import React, {useEffect} from "react";
import classNames from "classnames";
import "./CollectorPage.scss";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import { useAccount, useEnsName } from "wagmi";
import { SYSTEM_STAGE } from "consts";
import Box from "components/Box";
import Invite from "components/Invite";
import NFTs from "components/NFTs";
import { getCDNImageUrl, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useNoScrollView from "hooks/useNoScrollView";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";
import {collectorSelector, loadCollectorByAddress} from "store/collectorReducer";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import useActionDispatch from "hooks/useActionDispatch";

const CollectorPage = () => {
  const isMobile = useMobileOrTablet();
  useNoScrollView(isMobile);

  const { systemStage } = useSelector(systemSelector);
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();
  const collector = useSelector(collectorSelector);
  const actionDispatch = useActionDispatch();

  useMusic("collector.mp3");

  useEffect(() => {
    if (account?.address) {
      actionDispatch(
        loadCollectorByAddress(account?.address),
        "get-collector-by-address"
      );
    }
  }, [account?.address])

  const renderContent = () => {
    if (collector?.minted || systemStage > SYSTEM_STAGE.KEY) return <NFTs />;
    return <Invite />;
  };

  return (
    <Page
      pageName="collector"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      collectorLoader={!!collector}
      waitForTokens
    >
      <div className={classNames("page collector-page")}>
        <div className="bg collector-bg" />
        <div className="inner-page">
          <h1>The Collector's Room</h1>
          <div className="center-center-aligned-row account">
            {ensName?.data || shortenEthAddress(account?.address)}
          </div>
          <Box className={"main-box"}>
            {renderContent()}
            <HighlightOffIcon
              className="close"
              onClick={() => navigate("/explore")}
            />
          </Box>
        </div>
      </div>
    </Page>
  );
};

export default CollectorPage;
