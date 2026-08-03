import { LEVEL_SCORE_BASE, LEVEL_SCORE_PER_SECOND } from './consts';

export const levelScore = (seconds: number): number =>
  Math.max(0, LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * Math.round(seconds));
