import React from "react";
import classNames from "classnames";
import "./CollectorLayout.scss";
import { useAccount, useEnsName } from "wagmi";
import Box from "components/Box";
import { getCDNImageUrl, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useNoScrollView from "hooks/useNoScrollView";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";
import { useMobileOrTablet } from "hooks/useMediaQueries";

const CollectorLayout = ({
  boxClassName,
  boxStyles = {},
  boxAnimation,
  renderBoxIcons,
  disableNoScroll,
  children,
  ...pageProps
}) => {
  const isMobile = useMobileOrTablet();
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();

  useNoScrollView(isMobile || disableNoScroll);

  useMusic("collector.mp3");

  return (
    <Page
      pageName="collector"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      {...pageProps}
    >
      <div className={classNames("page collector-layout collector-page")}>
        <div className="bg collector-bg" />
        <div className="inner-page">
          <h1>The Collector's Room</h1>
          <div className="center-center-aligned-row account">
            {ensName?.data || shortenEthAddress(account?.address)}
          </div>
          <Box
            className={classNames("main-box", boxClassName)}
            style={boxStyles}
          >
            {boxAnimation && (
              <div
                className={classNames("bg box-animation", {
                  close: boxAnimation === "close",
                  open: boxAnimation === "open",
                })}
              >
                <div className="anim-part left-top" />
                <div className="anim-part right-top" />
                <div className="anim-part right-bottom" />
                <div className="anim-part left-bottom" />
              </div>
            )}
            {children}
            <div className="right-center-aligned-row icons-menu">
              {renderBoxIcons && renderBoxIcons()}
              <HighlightOffIcon
                className="close"
                onClick={() => navigate("/explore")}
              />
            </div>
          </Box>
        </div>
      </div>
    </Page>
  );
};

export default CollectorLayout;
