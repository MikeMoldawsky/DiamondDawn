import React, { useEffect, useState } from "react";
import Loading from "components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector, updateUiState } from "store/uiReducer";
import classNames from "classnames";
import { isActionFirstCompleteSelector } from "store/actionStatusReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useTimeout from "hooks/useTimeout";
import useNoScrollView from "hooks/useNoScrollView";
import usePermission from "hooks/usePermission";
import useWaitFor from "hooks/useWaitFor";

const DEFAULT_TIMEOUT = 15000;
const SHOW_TEXT_TIME = 100;
const FADE_DURATION = 150;

const PageCover = ({ fade, showText, withText, isPage }) => {
  useNoScrollView(!isPage);

  return (
    <div
      className={classNames("center-aligned-column page-cover", {
        hide: fade,
      })}
    >
      <Loading />
      {withText && (
        <div className="secondary-text">
          {showText && "DIAMOND DAWN"}
          <br />
          {showText && "loading..."}
        </div>
      )}
    </div>
  );
};

const Page = ({
  pageName,
  images = [],
  videos = [],
  timeout = DEFAULT_TIMEOUT,
  withLoader = true,
  withLoaderText = true,
  requireAccess = true,
  onReady,
  isPage = true,
  children,
}) => {
  const { assetReadyPages } = useSelector(uiSelector);
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);
  const [showText, setShowText] = useState(false);
  const contentReady = useWaitFor({ images, videos });
  const canAccessDD = usePermission();
  const isCollectorFetched = useSelector(
    isActionFirstCompleteSelector("get-collector-by-address")
  );
  const navigate = useNavigate();
  const account = useAccount();
  const isCollectorReady = isCollectorFetched || !account?.address;
  const pageReady = assetReadyPages[pageName] && isCollectorReady;

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
    if ((!requireAccess || canAccessDD) && contentReady && isCollectorReady) {
      setAssetsReady();
    }
  };

  // navigate out if doesn't have access
  useEffect(() => {
    if (requireAccess && isCollectorReady && !canAccessDD) {
      navigate("/");
    }
  }, [isCollectorReady]);

  // monitor contentReady
  useEffect(() => {
    if (contentReady) {
      onAssetLoaded();
    }
  }, [contentReady]);

  // monitor isCollectorFetched
  useEffect(() => {
    if (isCollectorFetched) {
      onAssetLoaded();
    }
  }, [isCollectorFetched]);

  // timeout
  useTimeout(() => {
    timeout > -1 && setAssetsReady();
  }, timeout);

  // TODO - remove this after setting up app-shell caching
  setTimeout(() => {
    setShowText(true);
  }, SHOW_TEXT_TIME);

  return (
    <>
      {children}
      {withLoader && !pageReady && !hidden && (
        <PageCover
          fade={fade}
          showText={showText}
          withText={withLoaderText}
          isPage={isPage}
        />
      )}
    </>
  );
};

export default Page;
