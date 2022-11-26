import React, {useEffect, useRef, useState} from "react";
import { useSelector } from "react-redux";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import {
  isActionFirstCompleteSelector,
  isActionSuccessSelector,
} from "store/actionStatusReducer";
import sumBy from "lodash/sumBy";
import get from "lodash/get";
import forEach from "lodash/forEach";

export const useWaitForActions = (actions) => {
  return useSelector((state) => {
    return reduce(
      actions,
      (isReady, action) => {
        let isActionReady;
        if (isString(action)) {
          isActionReady = isActionSuccessSelector(action)(state);
        } else {
          const { key, isFirstComplete } = action;
          isActionReady = isFirstComplete
            ? isActionFirstCompleteSelector(key)(state)
            : isActionSuccessSelector(key)(state);
        }

        return isReady && isActionReady;
      },
      true
    );
  });
};

export const useWaitForImages = (images = []) => {
  const [loaded, setLoaded] = useState(images.length === 0)

  useEffect(() => {
    let imagesLoaded = 0;

    forEach(images, (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
          setLoaded(true)
        }
      };
    });
  }, []);

  return loaded
};

export const useWaitForVideos = (videos = []) => {
  const [loaded, setLoaded] = useState(videos.length === 0)

  console.log({ videos })
  const videosProgress = sumBy(videos, ({ progress }) =>
    get(progress, "loaded", 0)
  );

  useEffect(() => {
    if (!loaded) {
      let videosLoaded = 0;

      forEach(videos, ({ progress, threshold = 1 }) => {
        const loaded = get(progress, "loaded", 0);
        console.log({ loaded })
        if (loaded >= threshold) {
          videosLoaded++;
          if (videosLoaded === videos.length) {
            setLoaded(true)
          }
        }
      });
    }
  }, [videosProgress]);

  return loaded
};

export const useWaitFor = ({ actions, images, videos }, name) => {
  const actionsReady = useWaitForActions(actions);
  const imagesReady = useWaitForImages(images);
  const videosReady = useWaitForVideos(videos);

  return actionsReady && imagesReady && videosReady;
};

export default useWaitFor;
