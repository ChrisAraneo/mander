import type { createRandom } from '@mander/utils';
import { STRUCTURES_PER_LEVEL } from '../../consts';
import { countIn } from './internal/count-in';
import { pickStructures } from './internal/pick-structures';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const pickWorldStructures = (
  levelCategories: LevelCategory[],
  random: ReturnType<typeof createRandom>,
): WorldStructures => ({
  NORMAL: pickStructures(
    countIn(levelCategories, 'NORMAL') * STRUCTURES_PER_LEVEL,
    'NORMAL',
    random,
  ),
  HARD: pickStructures(
    countIn(levelCategories, 'HARD') * STRUCTURES_PER_LEVEL,
    'HARD',
    random,
  ),
  VERTICAL: pickStructures(
    countIn(levelCategories, 'VERTICAL') * STRUCTURES_PER_LEVEL,
    'VERTICAL',
    random,
  ),
});
