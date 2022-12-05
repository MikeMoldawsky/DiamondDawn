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
import WaitFor from "containers/WaitFor";
import Invite from "components/Invite";
import NFTs from "components/NFTs";
import { getCDNImageUrl, isNoContractMode, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import PageSizeLimit from "components/PageSizeLimit";
import useNoScrollView from "hooks/useNoScrollView";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";

const CollectorPage = () => {
  useNoScrollView();

  const tokens = useSelector(tokensSelector);
  const { systemStage } = useSelector(systemSelector);
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();

  useMusic("collector.mp3");

  const renderContent = () => {
    if (size(tokens) > 0) return <NFTs />;

    if (systemStage <= SYSTEM_STAGE.KEY) return <Invite />;

    return (
      <div className="box-content opaque opensea">
        <div className="secondary-text">Your Collection is Empty</div>
        <div className="button link-opensea">GO TO OPENSEA</div>
      </div>
    );
  };

  const waitForActions = ["get-contract"];
  if (!isNoContractMode() && account?.address) {
    waitForActions.push({ isFirstComplete: true, key: "load-nfts" });
  }

  return (
    <PageSizeLimit>
      <Page
        pageName="collector"
        images={[getCDNImageUrl("/collector/collector-bg.png")]}
        collectorLoader={false}
      >
        <div className={classNames("page collector-page")}>
          <div className="bg collector-bg" />
          <div className="inner-page">
            <h1>The Collector's Room</h1>
            <div className="center-center-aligned-row account">
              {ensName?.data || shortenEthAddress(account?.address)}
            </div>
            <Box className={"main-box"}>
              <WaitFor
                containerClassName="box-content opaque"
                actions={waitForActions}
              >
                {renderContent()}
              </WaitFor>
              <HighlightOffIcon
                className="close"
                onClick={() => navigate("/explore")}
              />
            </Box>
          </div>
        </div>
      </Page>
    </PageSizeLimit>
  );
};

export default CollectorPage;
