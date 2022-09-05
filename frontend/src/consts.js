export const SYSTEM_STAGE = {
  NO_STAGE: 0,
  INVITATIONS: 1,
  MINE_OPEN: 2,
  CUT_OPEN: 3,
  POLISH_OPEN: 4,
  SHIP: 5,
};

export const SYSTEM_STAGE_NAME = {
  [SYSTEM_STAGE.NO_STAGE]: "No Stage",
  [SYSTEM_STAGE.INVITATIONS]: "Invitations",
  [SYSTEM_STAGE.MINE_OPEN]: "Mine",
  [SYSTEM_STAGE.CUT_OPEN]: "Cut",
  [SYSTEM_STAGE.POLISH_OPEN]: "Polish",
  [SYSTEM_STAGE.SHIP]: "Ship",
};

export const DIAMOND_DAWN_TYPE = {
  NO_TYPE: 0,
  ENTER_MINE: 1,
  ROUGH: 2,
  CUT: 3,
  POLISHED: 4,
  REBORN: 5,
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
  RADIANT: 4,
};
export const EVENTS = {
  StageChanged: "StageChanged",
};

export const DUMMY_VIDEO_URL =
  "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/final.mp4";

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
};
