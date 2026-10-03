import type { createRandom } from '@mander/utils';
import { STRUCTURES_PER_LEVEL } from '../consts';
import { countIn } from './internal/count-in';
import { pickRandomStructures } from './internal/pick-random-structures';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const pickRandomWorldStructures = (
  levelCategories: LevelCategory[],
  random: ReturnType<typeof createRandom>,
): WorldStructures => ({
  NORMAL: pickRandomStructures(
    countIn(levelCategories, 'NORMAL') * STRUCTURES_PER_LEVEL,
    'NORMAL',
    random,
  ),
  HARD: pickRandomStructures(
    countIn(levelCategories, 'HARD') * STRUCTURES_PER_LEVEL,
    'HARD',
    random,
  ),
  VERTICAL: pickRandomStructures(
    countIn(levelCategories, 'VERTICAL') * STRUCTURES_PER_LEVEL,
    'VERTICAL',
    random,
  ),
});
