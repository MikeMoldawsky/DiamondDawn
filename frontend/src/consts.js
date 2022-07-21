export const STAGE = {
  MINE: 0,
  CUT: 1,
  POLISH: 2,
  PHYSICAL: 3,
  REBIRTH: 4,
}

export const SHAPE = {
  OVAL: 0,
  RADIANT: 1,
  PEAR: 2,
  ROUGH: 3,
}

export const EVENTS = {
  StageChanged: 'StageChanged',
  WhitelistUpdated: 'WhitelistUpdated',
}

const VIDEO_BY_STAGE = {
  [STAGE.MINE]: 'rough.jpeg',
  [STAGE.CUT]: 'cut.mp4',
  [STAGE.POLISH]: 'polish.mp4',
  [STAGE.PHYSICAL]: 'burn.mp4',
  [STAGE.REBIRTH]: 'final.mp4',
}