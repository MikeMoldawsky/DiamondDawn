export const SYSTEM_STAGE = {
  NO_STAGE: 0,
  KEY: 1,
  MINE: 2,
  CUT: 3,
  POLISH: 4,
  DAWN: 5,
  COMPLETED: 6,
};

export const SYSTEM_STAGE_NAME = {
  [SYSTEM_STAGE.NO_STAGE]: "No Stage",
  [SYSTEM_STAGE.KEY]: "Key",
  [SYSTEM_STAGE.MINE]: "Mine",
  [SYSTEM_STAGE.CUT]: "Cut",
  [SYSTEM_STAGE.POLISH]: "Polish",
  [SYSTEM_STAGE.DAWN]: "Dawn",
  [SYSTEM_STAGE.COMPLETED]: "Completed",
};

export const ROUGH_SHAPE = {
  NO_SHAPE: 0,
  MAKEABLE_1: 1,
  MAKEABLE_2: 2,
};

export const SHAPE = {
  NO_SHAPE: 0,
  PEAR: 1,
  ROUND: 2,
  OVAL: 3,
  CUSHION: 4,
};

export const EVENTS = {
  StageChanged: "StageChanged",
};

export const DIAMOND_DAWN_TWITTER_URL = "https://twitter.com/DiamondDawnNFT";

export const DIAMOND_DAWN_TELEGRAM = "https://t.me/+h-IWpeZM_dNkODk0";

export const PRIVATE_TWITTER_URL =
  "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20";

export const TRAIT = {
  carat: "Carat",
  clarity: "Clarity",
  color: "Color",
  cut: "Cut",
  depth: "Depth",
  fluorescence: "Fluorescence",
  length: "Length",
  polish: "Polish",
  date: "Report Date",
  number: "Report Number",
  shape: "Shape",
  symmetry: "Symmetry",
  width: "Width",
  type: "Type",
  stage: "Stage",
};

export const ROUGH_SHAPE_NAME = {
  NO_SHAPE: "No Shape",
  MAKEABLE_1: "Makeable 1",
  MAKEABLE_2: "Makeable 2",
};

export const SHAPE_NAME = {
  NO_SHAPE: "No Shape",
  PEAR: "Pear",
  ROUND: "Round",
  OVAL: "Oval",
  CUSHION: "Cushion",
};

export const DIAMOND_ANIMATION_MAPPING = {
  [SYSTEM_STAGE.KEY]: {
    [SHAPE_NAME.NO_SHAPE]: "infinity.mp4",
  },
  [SYSTEM_STAGE.MINE]: {
    [ROUGH_SHAPE_NAME.MAKEABLE_1]: "rough_makeable1.mp4",
    [ROUGH_SHAPE_NAME.MAKEABLE_2]: "rough_makeable2.mp4",
  },
  [SYSTEM_STAGE.CUT]: {
    [SHAPE_NAME.PEAR]: "cut_pear.mp4",
    [SHAPE_NAME.ROUND]: "cut_round.mp4",
    [SHAPE_NAME.OVAL]: "cut_oval.mp4",
    [SHAPE_NAME.CUSHION]: "cut_radiant.mp4",
  },
  [SYSTEM_STAGE.POLISH]: {
    [SHAPE_NAME.PEAR]: "polished_pear.mp4",
    [SHAPE_NAME.ROUND]: "polished_round.mp4",
    [SHAPE_NAME.OVAL]: "polished_oval.mp4",
    [SHAPE_NAME.CUSHION]: "polished_radiant.mp4",
  },
  [SYSTEM_STAGE.DAWN]: {
    [SHAPE_NAME.PEAR]: "diamond_dawn.mp4",
    [SHAPE_NAME.ROUND]: "diamond_dawn.mp4",
    [SHAPE_NAME.OVAL]: "diamond_dawn.mp4",
    [SHAPE_NAME.CUSHION]: "diamond_dawn.mp4",
  },
};

export const PROCESS_GAS_LIMIT = 220000;
