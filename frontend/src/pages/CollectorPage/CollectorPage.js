import React, { useEffect } from "react";
import classNames from "classnames";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useEnsName } from "wagmi";
import Box from "components/Box";
import NFTs from "components/NFTs";
import { getCDNImageUrl, shortenEthAddress } from "utils";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useNoScrollView from "hooks/useNoScrollView";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useNavigate } from "react-router-dom";
import { collectorSelector } from "store/collectorReducer";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import { setSelectedTokenId, uiSelector, updateUiState } from "store/uiReducer";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CollectorLoader from "containers/CollectorLoader";
import { tokensSelector } from "store/tokensReducer";
import size from "lodash/size";
import useSound from "use-sound";
import mintCompleteSFX from "assets/audio/mint-complete.mp3";
import { TwitterShareNFTLink } from "components/Links";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CollectorPage = () => {
  const isMobile = useMobileOrTablet();
  const tokens = useSelector(tokensSelector);
  const { selectedTokenId, collectorBoxAnimation } = useSelector(uiSelector);
  const account = useAccount();
  const ensName = useEnsName({ address: account?.address });
  const navigate = useNavigate();
  const collector = useSelector(collectorSelector);
  const dispatch = useDispatch();
  const sizeTokens = size(tokens);
  const isNftGallery = sizeTokens > 0 && selectedTokenId === -1;
  const galleryRows = isMobile ? sizeTokens : Math.ceil(sizeTokens / 3);
  // const [playMintCompleteSFX] = useSound(mintCompleteSFX);

  useNoScrollView(isMobile || (isNftGallery && galleryRows > 1));

  useMusic("collector.mp3");

  // useEffect(() => {
  //   if (collector?.minted) {
  //     playMintCompleteSFX();
  //     dispatch(updateUiState({ collectorBoxAnimation: "open" }));
  //     setTimeout(() => {
  //       dispatch(updateUiState({ collectorBoxAnimation: "" }));
  //     }, 500);
  //   }
  // }, [collector?.minted]);

  const getGalleryVWHeight = () => galleryRows * (isMobile ? 90 : 30);

  const mainBoxStyles = isNftGallery
    ? {
        height: `${getGalleryVWHeight()}vw`,
      }
    : {};

  return (
    <Page
      pageName="collector"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      // collectorLoader={!!collector}
      // waitForTokens
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
              "nfts-gallery": isNftGallery,
            })}
            style={mainBoxStyles}
          >
            {collectorBoxAnimation && (
              <div
                className={classNames("bg box-animation", {
                  close: collectorBoxAnimation === "close",
                  open: collectorBoxAnimation === "open",
                })}
              >
                <div className="anim-part left-top" />
                <div className="anim-part right-top" />
                <div className="anim-part right-bottom" />
                <div className="anim-part left-bottom" />
              </div>
            )}
            {/*<CollectorLoader />*/}
            <NFTs />
            <div className="right-center-aligned-row icons-menu">
              {selectedTokenId > -1 && (
                <>
                  <TwitterShareNFTLink
                    className="icon-twitter button gold sm icon-after"
                    tokenId={selectedTokenId}
                  >
                    SHARE <FontAwesomeIcon icon={faTwitter} />
                  </TwitterShareNFTLink>
                  <CollectionsOutlinedIcon
                    className="gallery-icon"
                    onClick={() => dispatch(setSelectedTokenId(-1))}
                  />
                </>
              )}
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

export default CollectorPage;
