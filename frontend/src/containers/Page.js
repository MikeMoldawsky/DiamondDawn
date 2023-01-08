import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector, updateUiState } from "store/uiReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import useTimeout from "hooks/useTimeout";
import useCanAccessDD from "hooks/useCanAccessDD";
import useWaitFor from "hooks/useWaitFor";
import PageCover from "components/PageCover";
import useOnConnect from "hooks/useOnConnect";
import { isNoContractMode } from "utils";
import useCollectorReady from "hooks/useCollectorReady";
import {ACTION_KEYS} from "consts";

const DEFAULT_TIMEOUT = 10000;
const FADE_DURATION = 150;

const Page = ({
  pageName,
  images = [],
  videos = [],
  actions = [],
  waitForTokens,
  timeout = DEFAULT_TIMEOUT,
  withLoader = true,
  requireAccess = true,
  collectorLoader = true,
  onReady,
  children,
}) => {
  const account = useAccount();
  const { assetReadyPages } = useSelector(uiSelector);
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);
  const isConnected = account?.address;

  const waitForActions = [...actions];
  if (!isNoContractMode()) {
    waitForActions.push(ACTION_KEYS.GET_CONTRACT);

    if (waitForTokens) {
      waitForActions.push({ isFirstComplete: true, key: ACTION_KEYS.LOAD_NFTS });
    }
  }
  if (isConnected) {
    waitForActions.push(ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS);
  }

  const contentReady = useWaitFor({ images, videos, actions: waitForActions });
  const canAccessDD = useCanAccessDD();
  const isCollectorReady = useCollectorReady()
  const navigate = useNavigate();
  const pageReady = assetReadyPages[pageName] && isCollectorReady;

  const setAssetsReady = () => {
    if (requireAccess && !canAccessDD) return;

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

  useOnConnect((address) => {
    if (collectorLoader && !!address) {
      setFade(false);
      setHidden(false);
    }
  });

  // navigate out if doesn't have access
  useEffect(() => {
    if (requireAccess && !canAccessDD && isCollectorReady) {
      return navigate("/");
    }
  }, [isCollectorReady]);

  // monitor contentReady
  useEffect(() => {
    if (contentReady) {
      setAssetsReady();
    }
  }, [contentReady]);

  // timeout
  useTimeout(() => {
    timeout > -1 && setAssetsReady();
  }, timeout);

  return (
    <>
      {children}
      {withLoader && !pageReady && !hidden && <PageCover fade={fade} />}
    </>
  );
};

export default Page;
