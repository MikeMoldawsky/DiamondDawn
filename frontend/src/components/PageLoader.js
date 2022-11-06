import React, {useEffect, useRef, useState} from 'react'
import forEach from "lodash/forEach";
import sumBy from "lodash/sumBy";
import get from "lodash/get";
import Loading from "components/Loading";
import useTimeout from "hooks/useTimeout";
import {useDispatch, useSelector} from "react-redux";
import {uiSelector, updateUiState} from "store/uiReducer";
import classNames from "classnames";

const PageLoader = ({ pageName, images = [], videos = [], timeout = 10000, withLoader = true, children }) => {
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
    }, 150)
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
    setAssetsReady()
  }, timeout)

  setTimeout(() => {
    setShowText(true)
  }, 100)

  return (
    <>
      {children}
      {withLoader && !assetsReady && !hidden && (
        <div className={classNames("center-aligned-column page-loader", { hide: fade })}>
          <Loading />
          <div className="secondary-text">{showText && "Please wait while"}<br/>{showText && "DIAMOND DOWN is loading"}</div>
        </div>
      )}
    </>
  )
}

export default PageLoader