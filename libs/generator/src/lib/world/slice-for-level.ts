import { floor, size, slice } from 'lodash-es';
import { countEarlierCopies } from './internal/count-earlier-copies';
import { countOccurrences } from './internal/count-occurrences';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const sliceForLevel = (
  worldStructures: WorldStructures,
  levelCategories: LevelCategory[],
  index: number,
) => {
  const levelCategory = levelCategories[index];
  const structures = worldStructures[levelCategory];
  const perLevel = floor(
    size(structures) / countOccurrences(levelCategories, levelCategory),
  );
  const rank = countEarlierCopies(levelCategories, index);

  return slice(structures, rank * perLevel, (rank + 1) * perLevel);
};
