export const SYSTEM_STAGE = {
  INVITATIONS: 0,
  MINE_OPEN: 1,
  CUT_OPEN: 2,
  POLISH_OPEN: 3,
  SHIP: 4,
  COMPLETE: 5,
};

export const SYSTEM_STAGE_NAME = {
  [SYSTEM_STAGE.INVITATIONS]: "Mine",
  [SYSTEM_STAGE.MINE_OPEN]: "Mine",
  [SYSTEM_STAGE.CUT_OPEN]: "Cut",
  [SYSTEM_STAGE.POLISH_OPEN]: "Polish",
  [SYSTEM_STAGE.SHIP]: "Ship",
  [SYSTEM_STAGE.COMPLETE]: "Complete",
};

export const DIAMOND_DAWN_TYPE = {
  ENTER_MINE: 0,
  ROUGH: 1,
  CUT: 2,
  POLISHED: 3,
  BURNED: 4,
  REBORN: 5,
};

export const ROUGH_SHAPE = {
  NO_SHAPE: 0,
  MAKEABLE: 1,
};

export const SHAPE = {
  NO_SHAPE: 0,
  PEAR: 1,
  ROUND: 2,
  OVAL: 3,
  RADIANT: 4,
};
export const EVENTS = {
  SystemStageChanged: "SystemStageChanged",
};

export const DUMMY_VIDEO_URL =
  "https://tweezers-public.s3.amazonaws.com/diamond-dawn-nft-mocks/final.mp4";

export const PRIVATE_TWITTER_URL = "https://twitter.com/messages/compose?recipient_id=1441153449328996359&text=I%20would%20like%20to%20join%20the%20Vanguards%20"

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
