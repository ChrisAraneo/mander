import { times } from 'lodash-es';

import { LEVELS_PER_SEED } from '../consts';
import type { Level } from '../types';
import { generateLevel } from './generate-level';
import { levelSeed } from './level-seed';

export const generateLevelSet = (baseSeed: string): Level[] =>
  times(LEVELS_PER_SEED, (index) =>
    generateLevel(levelSeed(baseSeed, index), index),
  );
