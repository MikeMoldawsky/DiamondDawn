import { createVideoSources, getCDNVideoUrl, getVideoBitrate } from "utils";

// FRONT PAGE
export const getDDTextVideo = (width) => {
  let fileName = "dd-text-1440";
  // if (width <= 480) fileName += "-480";
  // else
  // if (width <= 1024) fileName += "-1440";

  return createVideoSources(fileName);
};

export const getPSTextVideo = (width) => {
  let fileName = "ps-text-480";
  // if (width <= 480) fileName += "-240";
  // else
  // if (width <= 1024) fileName += "-480";

  return createVideoSources(fileName);
};

export const getPSDateVideo = (width) => {
  let fileName = "ps-date";
  return createVideoSources(fileName);
};

export const getMobileBGVideo = (width) => {
  let fileName = "coming_soon_mobile";
  // if (width <= 360) fileName += "-300";
  if (width <= 480) fileName += "-400";
  else if (width <= 768) fileName += "-588";

  return [{ src: getCDNVideoUrl(`${fileName}.mp4`), type: "video/mp4" }];
};

// EXPLORE
export const getEarthAndMoonVideo = (width, height) => {
  let fileName = "earth-and-moon-loop";
  if (width <= 720) fileName += "-720";
  else if (width <= 960) fileName += "-960";
  else {
    return [
      { src: getCDNVideoUrl(`earth-moon-loop-5m.mp4`), type: "video/mp4" },
    ];
  }

  return createVideoSources(fileName);
};

export const getRoughStoneSpinVideo = (width) => {
  return createVideoSources("rough-stone-spin-480");
};

// TRAILERS
export const getTrailerVideos = (width) => {
  const bitrate = getVideoBitrate(width);
  return [
    {
      src: getCDNVideoUrl(`digital-trailer-${bitrate}.mp4`),
      name: "THE DIGITAL",
    },
    {
      src: getCDNVideoUrl(`physical-trailer-${bitrate}.mp4`),
      name: "THE PHYSICAL",
    },
  ];
};

export const getPhysicalLoopVideo = (width) => {
  const bitrate = getVideoBitrate(width);
  return getCDNVideoUrl(`physical-loop-${bitrate}.mp4`);
};
