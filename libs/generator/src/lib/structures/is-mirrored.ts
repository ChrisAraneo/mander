import { includes } from 'lodash-es';

export const MIRRORED_LEVELS: readonly number[] = Object.freeze([3, 6]);

export const isMirrored = (levelNumber: number): boolean =>
  includes(MIRRORED_LEVELS, levelNumber);
