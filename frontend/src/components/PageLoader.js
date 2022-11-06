import React, {useEffect, useRef} from 'react'
import forEach from "lodash/forEach";
import Loading from "components/Loading";
import useTimeout from "hooks/useTimeout";
import {useDispatch, useSelector} from "react-redux";
import {uiSelector, updateUiState} from "store/uiReducer";

const PageLoader = ({ pageName, images = [], videos = [], timeout = 10000, children }) => {
  const { assetReadyPages } = useSelector(uiSelector)
  const imagesLoaded = useRef(0)
  const videosLoaded = useRef(0)
  const dispatch = useDispatch()

  const assetsReady = assetReadyPages[pageName]

  const setAssetsReady = () => {
    dispatch(updateUiState({
      assetReadyPages: { ...assetReadyPages, [pageName]: true }
    }))
  }

  const onAssetLoaded = () => {
    if (imagesLoaded.current === images.length && videosLoaded.current === videos.length) {
      setAssetsReady(true)
      console.log('ASSETS READY')
    }
  }

  useEffect(() => {
    if (assetReadyPages[pageName]) {
      setAssetsReady(true);
      return
    }
    forEach(images, src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        console.log('IMAGE READY')
        imagesLoaded.current = imagesLoaded.current + 1;
        onAssetLoaded()
      };
    })
  }, []);

  useTimeout(() => {
    setAssetsReady(true)
  }, timeout)

  return (
    <>
      {children}
      {!assetsReady && (
        <div className="center-aligned-column page-loader">
          <Loading />
          <div className="secondary-text">Please wait while<br/>DIAMOND DOWN is loading</div>
        </div>
      )}
    </>
  )
}

export default PageLoader