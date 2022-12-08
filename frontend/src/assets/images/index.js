import {getCDNImageUrl} from "utils";

// EXPLORE
export const getStatueImage = (width) => {
  let fileName = "statue";
  if (width <= 480) fileName += "-480";
  else fileName += "-960";

  return getCDNImageUrl(fileName);
};