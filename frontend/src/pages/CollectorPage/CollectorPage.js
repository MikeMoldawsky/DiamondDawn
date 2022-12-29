import React from "react";
import classNames from "classnames";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
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
import { collectorSelector } from "store/collectorReducer";
import { useMobileOrTablet } from "hooks/useMediaQueries";

const CollectorPage = () => {
  const isMobile = useMobileOrTablet();
  useNoScrollView(isMobile);

  const tokens = useSelector(tokensSelector);
  const { systemStage } = useSelector(systemSelector);
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();
  const collector = useSelector(collectorSelector);

  useMusic("collector.mp3");

  const renderContent = () => {
    if (size(tokens) > 0) return <NFTs />;

    if (systemStage <= SYSTEM_STAGE.KEY) return <Invite />;

    return (
      <div className="box-content opaque opensea">
        <div className="tagline-text">Your Collection is Empty</div>
        <div className="button link-opensea">GO TO OPENSEA</div>
      </div>
    );
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
