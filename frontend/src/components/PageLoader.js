import React, { useEffect, useRef, useState } from "react";
import forEach from "lodash/forEach";
import sumBy from "lodash/sumBy";
import get from "lodash/get";
import Loading from "components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector, updateUiState } from "store/uiReducer";
import classNames from "classnames";
import { canAccessDDSelector } from "store/selectors";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useTimeout from "hooks/useTimeout";

const DEFAULT_TIMEOUT = 15000;
const SHOW_TEXT_TIME = 100;
const FADE_DURATION = 150;

const PageCover = ({ fade, showText }) => {
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div
      className={classNames("center-aligned-column page-cover", {
        hide: fade,
      })}
    >
      <Loading />
      <div className="secondary-text">
        {showText && "DIAMOND DAWN"}
        <br />
        {showText && "loading..."}
      </div>
    </div>
  );
};

const PageLoader = ({
  pageName,
  images = [],
  videos = [],
  timeout = DEFAULT_TIMEOUT,
  withLoader = true,
  requireAccess = true,
  onReady,
  children,
}) => {
  const { assetReadyPages } = useSelector(uiSelector);
  const imagesLoaded = useRef(0);
  const videosLoaded = useRef(0);
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);
  const [showText, setShowText] = useState(false);
  const canAccessDD = useSelector(canAccessDDSelector);
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );
  const navigate = useNavigate();
  const account = useAccount();

  const assetsReady = assetReadyPages[pageName] && isCollectorFetched;

  const setAssetsReady = () => {
    setFade(true);
    setTimeout(() => {
      dispatch(
        updateUiState({
          assetReadyPages: { ...assetReadyPages, [pageName]: true },
        })
      );
      setHidden(true);
      onReady && onReady();
    }, FADE_DURATION);
  };

  const onAssetLoaded = () => {
    if (
      isCollectorFetched &&
      (!requireAccess || canAccessDD) &&
      imagesLoaded.current === images.length &&
      videosLoaded.current === videos.length
    ) {
      setAssetsReady();
    }
  };

  // images
  useEffect(() => {
    if (assetReadyPages[pageName]) {
      setFade(true);
      return;
    }
    forEach(images, (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded.current++;
        onAssetLoaded();
      };
    });
  }, []);

  // videos
  const videosProgress = sumBy(videos, ({ progress }) =>
    get(progress, "loaded", 0)
  );

  useEffect(() => {
    forEach(videos, ({ progress, threshold = 1 }) => {
      const loaded = get(progress, "loaded", 0);
      if (loaded >= threshold) {
        videosLoaded.current++;
        onAssetLoaded();
      }
    });
  }, [videosProgress]);

  // timeout
  useTimeout(() => {
    timeout > -1 && setAssetsReady();
  }, timeout);

  useEffect(() => {
    console.log("useEffect", { isCollectorFetched });
    if (isCollectorFetched) {
      onAssetLoaded();
    } else {
      setFade(false);
      setHidden(false);
    }
  }, [isCollectorFetched]);

  useEffect(() => {
    if (requireAccess && isCollectorFetched && !canAccessDD) {
      console.log("PageLoader - navigating to /");
      navigate("/");
    }
  }, [isCollectorFetched, account?.address]);

  setTimeout(() => {
    setShowText(true);
  }, SHOW_TEXT_TIME);

  return (
    <>
      {children}
      {withLoader && !assetsReady && !hidden && (
        <PageCover fade={fade} showText={showText} />
      )}
    </>
  );
};

export default PageLoader;
