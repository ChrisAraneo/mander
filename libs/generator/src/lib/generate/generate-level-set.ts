import { times } from 'lodash-es';

import { LEVELS_PER_SEED } from '../consts';
import type { Level } from '../types';
import { generateLevel } from './generate-level';
import { levelSeed } from './level-seed';

export function generateLevelSet(baseSeed: string): Level[] {
  return times(LEVELS_PER_SEED, (index) =>
    generateLevel(levelSeed(baseSeed, index), index),
  );
}
