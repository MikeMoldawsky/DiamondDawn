import React from "react";
import classNames from "classnames";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import { useAccount } from "wagmi";
import { SYSTEM_STAGE } from "consts";
import Box from "components/Box";
import Suspense from "components/Suspense";
import Invite from "components/Invite";
import NFTs from "components/NFTs";
import { getCDNImageUrl, isNoContractMode, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import PageLoader from "components/PageLoader";
import PageSizeLimit from "components/PageSizeLimit";

const CollectorPage = () => {
  const tokens = useSelector(tokensSelector);
  const { systemStage } = useSelector(systemSelector);
  const account = useAccount();

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

  const suspenseActions = ["get-contract"];
  if (!isNoContractMode() && account?.address) {
    suspenseActions.push({ isFirstComplete: true, key: "load-nfts" });
  }

  return (
    <PageSizeLimit>
      <PageLoader
        pageName="collector"
        images={[getCDNImageUrl("/collector/collector-bg.png")]}
      >
        <div className={classNames("page collector-page")}>
          <div className="bg collector-bg" />
          <div className="inner-page">
            <h1>The Collector's Room</h1>
            <div className="center-center-aligned-row account">
              {shortenEthAddress(account?.address)}
            </div>
            <Box className={"main-box"}>
              <Suspense withLoader actions={suspenseActions}>
                {renderContent()}
              </Suspense>
            </Box>
          </div>
        </div>
      </PageLoader>
    </PageSizeLimit>
  );
};

export default CollectorPage;
