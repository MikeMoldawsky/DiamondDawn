import React from "react";
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
import MintKey from "components/MintKey";
import useSound from "use-sound";
import sparklesSFX from "assets/audio/end-sparkles.mp3";

const MintPage = () => {
  const isMobile = useMobileOrTablet();
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const collector = useSelector(collectorSelector);
  // const [playSparklesSFX] = useSound(sparklesSFX);

  useNoScrollView(isMobile);

  useMusic("collector.mp3");

  const renderContent = () => {
    if (collector?.approved) return (
      <div className="box-content approved">
        <MintKey isHonorary />
      </div>
    );

    return <Join />;
  };

  return (
    <Page
      pageName="mint"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      collectorLoader={!!collector}
    >
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
    </Page>
  );
};

export default MintPage;
