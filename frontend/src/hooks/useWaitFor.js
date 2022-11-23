import React, {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import {isActionFirstCompleteSelector, isActionSuccessSelector} from "store/actionStatusReducer";
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
  const imagesLoaded = useRef(0);

  useEffect(() => {
    forEach(images, (src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoaded.current++;
      };
    });
  }, []);

  return imagesLoaded.current === images.length;
}

export const useWaitForVideos = (videos = []) => {
  const videosLoaded = useRef(0);

  const videosProgress = sumBy(videos, ({ progress }) =>
    get(progress, "loaded", 0)
  );

  useEffect(() => {
    if (videosLoaded.current !== videos.length) {
      forEach(videos, ({ progress, threshold = 1 }) => {
        const loaded = get(progress, "loaded", 0);
        if (loaded >= threshold) {
          videosLoaded.current++;
        }
      });
    }
  }, [videosProgress]);

  return videosLoaded.current === videos.length;
};

export const useWaitFor = ({actions, images, videos}) => {
  const actionsReady = useWaitForActions(actions);
  const imagesReady = useWaitForImages(images)
  const videosReady = useWaitForVideos(videos);

  return actionsReady && imagesReady && videosReady;
}

export default useWaitFor