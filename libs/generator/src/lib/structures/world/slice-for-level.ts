import type { Sector } from '@mander/structures';
import { floor, size, slice } from 'lodash-es';
import type { LevelCategory } from './types/level-category';
import { countIn } from './internal/count-in';
import { getRank } from './internal/get-rank';
import type { WorldStructures } from './types/world-structures';

export const sliceForLevel = (
  worldStructures: WorldStructures,
  levelCategories: LevelCategory[],
  index: number,
): Sector[] => {
  const levelCategory = levelCategories[index];
  const structures = worldStructures[levelCategory];
  const perLevel = floor(
    size(structures) / countIn(levelCategories, levelCategory),
  );
  const rank = getRank(levelCategories, index);

  return slice(structures, rank * perLevel, (rank + 1) * perLevel);
};
