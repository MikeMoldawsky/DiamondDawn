export const SYSTEM_STAGE = {
  NO_STAGE: 0,
  INVITE: 1,
  MINE: 2,
  CUT: 3,
  POLISH: 4,
  SHIP: 5,
  DAWN: 6,
};

export const SYSTEM_STAGE_NAME = {
  [SYSTEM_STAGE.NO_STAGE]: "No Stage",
  [SYSTEM_STAGE.INVITE]: "Invite",
  [SYSTEM_STAGE.MINE]: "Mine",
  [SYSTEM_STAGE.CUT]: "Cut",
  [SYSTEM_STAGE.POLISH]: "Polish",
  [SYSTEM_STAGE.SHIP]: "Ship",
  [SYSTEM_STAGE.DAWN]: "Dawn",
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
  [SYSTEM_STAGE.INVITE]: {
    [SHAPE_NAME.NO_SHAPE]: 'infinity.mp4',
  },
  [SYSTEM_STAGE.MINE]: {
    [ROUGH_SHAPE_NAME.MAKEABLE_1]: 'rough_makeable1.mp4',
    [ROUGH_SHAPE_NAME.MAKEABLE_2]: 'rough_makeable2.mp4',
  },
  [SYSTEM_STAGE.CUT]: {
    [SHAPE_NAME.PEAR]: 'cut_pear.mp4',
    [SHAPE_NAME.ROUND]: 'cut_round.mp4',
    [SHAPE_NAME.OVAL]: 'cut_oval.mp4',
    [SHAPE_NAME.CUSHION]: 'cut_radiant.mp4',
  },
  [SYSTEM_STAGE.POLISH]: {
    [SHAPE_NAME.PEAR]: 'polished_pear.mp4',
    [SHAPE_NAME.ROUND]: 'polished_round.mp4',
    [SHAPE_NAME.OVAL]: 'polished_oval.mp4',
    [SHAPE_NAME.CUSHION]: 'polished_radiant.mp4',
  },
  [SYSTEM_STAGE.SHIP]: {
    [SHAPE_NAME.PEAR]: 'diamond_dawn.mp4',
    [SHAPE_NAME.ROUND]: 'diamond_dawn.mp4',
    [SHAPE_NAME.OVAL]: 'diamond_dawn.mp4',
    [SHAPE_NAME.CUSHION]: 'diamond_dawn.mp4',
  },
}
