import React, { useEffect, useRef } from "react";
import forEach from "lodash/forEach";
import sumBy from "lodash/sumBy";
import get from "lodash/get";

const useVideoLoader = (videos = []) => {
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

export default useVideoLoader;
