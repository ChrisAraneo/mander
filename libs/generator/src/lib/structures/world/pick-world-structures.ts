import { STRUCTURES_PER_LEVEL } from '../../consts';
import { countIn } from './internal/count-in';
import { pickStructures } from './internal/pick-structures';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const pickWorldStructures = (
  worldName: string,
  levelCategories: LevelCategory[],
): WorldStructures => ({
  NORMAL: pickStructures(
    worldName,
    countIn(levelCategories, 'NORMAL') * STRUCTURES_PER_LEVEL,
    'NORMAL',
  ),
  HARD: pickStructures(
    worldName,
    countIn(levelCategories, 'HARD') * STRUCTURES_PER_LEVEL,
    'HARD',
  ),
  VERTICAL: pickStructures(
    worldName,
    countIn(levelCategories, 'VERTICAL') * STRUCTURES_PER_LEVEL,
    'VERTICAL',
  ),
});
