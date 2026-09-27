import { includes } from 'lodash-es';
import { MIRRORED_LEVELS } from '../consts';

export const isMirrored = (levelNumber: number): boolean =>
  includes(MIRRORED_LEVELS, levelNumber);
