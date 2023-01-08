import React from "react";
import classNames from "classnames";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
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
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CollectorLoader from "containers/CollectorLoader";

const CollectorPage = () => {
  const isMobile = useMobileOrTablet();
  useNoScrollView(isMobile);

  const { systemStage } = useSelector(systemSelector);
  const { selectedTokenId } = useSelector(uiSelector);
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();
  const collector = useSelector(collectorSelector);
  const dispatch = useDispatch();

  useMusic("collector.mp3");

  const renderContent = () => {
    if (
      collector?.minted ||
      collector?.mintClosed ||
      systemStage > SYSTEM_STAGE.KEY
    )
      return <NFTs />;
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
          <Box
            className={classNames("main-box", {
              "nft-selected": selectedTokenId > -1,
            })}
          >
            <CollectorLoader />
            {renderContent()}
            {selectedTokenId > -1 && (
              <div
                className="back-to-gallery"
                onClick={() => dispatch(setSelectedTokenId(-1))}
              >
                <CollectionsOutlinedIcon />
              </div>
            )}
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
