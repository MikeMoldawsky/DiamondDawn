export const SYSTEM_STAGE = {
  MINE_OPEN: 0,
  CUT_OPEN: 1,
  POLISH_OPEN: 2,
  SHIP: 3,
  COMPLETE: 4,
};

export const SYSTEM_STAGE_NAME = {
  [SYSTEM_STAGE.MINE_OPEN]: 'Mine',
  [SYSTEM_STAGE.CUT_OPEN]: 'Cut',
  [SYSTEM_STAGE.POLISH_OPEN]: 'Polish',
  [SYSTEM_STAGE.SHIP]: 'Ship',
  [SYSTEM_STAGE.COMPLETE]: 'Complete',
}

export const NFT_TYPE = {
  Rough: "Rough",
  Cut: "Cut",
  Polished: "Polished",
  Burned: "Burned",
  Reborn: "Reborn",
  Unknown: "Unknown",
};

export const ROUGH_SHAPE = {
  MAKEABLE: 0,
};

export const SHAPE = {
  PEAR: 0,
  ROUND: 1,
  OVAL: 2,
  RADIANT: 3,
};

export const EVENTS = {
  SystemStageChanged: "SystemStageChanged",
};

export const DUMMY_VIDEO_URL =
  "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/final.mp4";

export const TRAIT = {
  carat: "Carat",
  clarity: "Clarity",
  color: "Color",
  cut: "Cut",
  depth: "Depth",
  fluorescence: "Fluorescence",
  length: "Length",
  polish: "Polish",
  reportDate: "Report Date",
  reportNumber: "Report Number",
  shape: "Shape",
  symmetry: "Symmetry",
  width: "Width",
  type: "Type",
};
