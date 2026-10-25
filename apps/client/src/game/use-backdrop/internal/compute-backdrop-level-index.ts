import type { Level } from '@mander/model';
import { clamp, size } from 'lodash-es';
import { BACKDROP_LEVEL } from '../consts';

export const computeBackdropLevelIndex = (levels: Level[]): number =>
  clamp(BACKDROP_LEVEL - 1, 0, size(levels) - 1);
