import React from "react";
import classNames from "classnames";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import NFTs from "components/NFTs";
// import useMusic from "hooks/useMusic";
// import useNoScrollView from "hooks/useNoScrollView";
import { useMobileOrTablet } from "hooks/useMediaQueries";
import { setSelectedTokenId, uiSelector, updateUiState } from "store/uiReducer";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { ownedTokensSelector } from "store/tokensReducer";
import size from "lodash/size";
import useSound from "use-sound";
import mintCompleteSFX from "assets/audio/mint-complete.mp3";
import { TwitterShareNFTLink } from "components/Links";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollectorLayout from "pages/layouts/CollectorLayout";

const CollectorPage = () => {
  const isMobile = useMobileOrTablet();
  const tokens = useSelector(ownedTokensSelector);
  const { selectedTokenId, collectorBoxAnimation } = useSelector(uiSelector);
  const dispatch = useDispatch();
  const sizeTokens = size(tokens);
  const isNftGallery = sizeTokens > 0 && selectedTokenId === -1;
  const galleryRows = isMobile ? sizeTokens : Math.ceil(sizeTokens / 3);
  // const [playMintCompleteSFX] = useSound(mintCompleteSFX);

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

  const boxStyles = isNftGallery
    ? {
        height: `${getGalleryVWHeight()}vw`,
      }
    : {};

  const boxClassName = classNames({
    "nft-selected": selectedTokenId > -1,
    "nfts-gallery": isNftGallery,
  });

  const renderBoxIcons = () => {
    return selectedTokenId > -1 ? (
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
    ) : null;
  };

  return (
    <CollectorLayout
      waitForTokens
      boxClassName={boxClassName}
      boxStyles={boxStyles}
      boxAnimation={collectorBoxAnimation}
      disableNoScroll={isNftGallery && galleryRows > 1}
      renderBoxIcons={renderBoxIcons}
    >
      <NFTs />
    </CollectorLayout>
  );
};

export default CollectorPage;
