import React, { useEffect, useRef } from "react";
import forEach from "lodash/forEach";
import sumBy from "lodash/sumBy";
import get from "lodash/get";
// import map from "lodash/map";
// import join from "lodash/join";

const useVideoLoader = (videos = []) => {
  const videosLoaded = useRef(0);

  // videos
  const videosProgress = sumBy(videos, ({ progress }) =>
    get(progress, "loaded", 0)
  );

  // const srcString = join(map(videos, ({ src }) => src))
  //
  // useEffect(() => {
  //   videosLoaded.current = 0
  // }, [srcString])

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

  console.log({ videosProgress, videosLoaded: videosLoaded.current, videos: videos.length })

  return videosLoaded.current === videos.length
};

export default useVideoLoader;
