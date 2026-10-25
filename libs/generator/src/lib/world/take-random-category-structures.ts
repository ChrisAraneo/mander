import type { Random } from '@mander/engine';
import { STRUCTURES_PER_LEVEL } from '../consts';
import { countOccurrences } from './internal/count-occurrences';
import { takeRandomStructures } from './internal/take-random-structures';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const takeRandomCategoryStructures = (
  levelCategories: LevelCategory[],
  random: Random,
): WorldStructures => ({
  NORMAL: takeRandomStructures(
    countOccurrences(levelCategories, 'NORMAL') * STRUCTURES_PER_LEVEL,
    'NORMAL',
    random,
  ),
  HARD: takeRandomStructures(
    countOccurrences(levelCategories, 'HARD') * STRUCTURES_PER_LEVEL,
    'HARD',
    random,
  ),
  VERTICAL: takeRandomStructures(
    countOccurrences(levelCategories, 'VERTICAL') * STRUCTURES_PER_LEVEL,
    'VERTICAL',
    random,
  ),
});
