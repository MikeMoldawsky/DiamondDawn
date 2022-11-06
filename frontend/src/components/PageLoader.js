import React, {useEffect, useRef, useState} from 'react'
import forEach from "lodash/forEach";
import sumBy from "lodash/sumBy";
import get from "lodash/get";
import Loading from "components/Loading";
import useTimeout from "hooks/useTimeout";
import {useDispatch, useSelector} from "react-redux";
import {uiSelector, updateUiState} from "store/uiReducer";
import classNames from "classnames";

const DEFAULT_TIMEOUT = 10000
const SHOW_TEXT_TIME = 100
const FADE_DURATION = 150

const PageLoader = ({ pageName, images = [], videos = [], timeout = DEFAULT_TIMEOUT, withLoader = true, children }) => {
  const { assetReadyPages } = useSelector(uiSelector)
  const imagesLoaded = useRef(0)
  const videosLoaded = useRef(0)
  const dispatch = useDispatch()
  const [hidden, setHidden] = useState(false)
  const [fade, setFade] = useState(false)
  const [showText, setShowText] = useState(false)

  const assetsReady = assetReadyPages[pageName]

  const setAssetsReady = () => {
    setFade(true)
    setTimeout(() => {
      dispatch(updateUiState({
        assetReadyPages: { ...assetReadyPages, [pageName]: true }
      }))
      setHidden(true)
    }, FADE_DURATION)
  }

  const onAssetLoaded = () => {
    if (imagesLoaded.current === images.length && videosLoaded.current === videos.length) {
      setAssetsReady()
    }
  }

  // images
  useEffect(() => {
    if (assetReadyPages[pageName]) {
      setFade(true);
      return
    }
    forEach(images, src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded.current++;
        onAssetLoaded()
      };
    })
  }, []);

  // videos
  const videosProgress = sumBy(videos, ({ progress }) => get(progress, 'loaded', 0))
  useEffect(() => {
    forEach(videos, ({ progress, threshold = 1 }) => {
      const loaded = get(progress, 'loaded', 0)
      if (loaded >= threshold) {
        videosLoaded.current++;
        onAssetLoaded()
      }
    })
  }, [videosProgress])

  // timeout
  useTimeout(() => {
    timeout > -1 && setAssetsReady()
  }, timeout)

  setTimeout(() => {
    setShowText(true)
  }, SHOW_TEXT_TIME)

  return (
    <>
      {children}
      {withLoader && !assetsReady && !hidden && (
        <div className={classNames("center-aligned-column page-cover", { hide: fade })}>
          <Loading />
          <div className="secondary-text">{showText && "Please wait while"}<br/>{showText && "DIAMOND DOWN is loading"}</div>
        </div>
      )}
    </>
  )
}

export default PageLoader