import type { Sector } from '@mander/structures';
import { floor, size, slice } from 'lodash-es';
import { pipe } from 'remeda';
import { countEarlierCopies } from './internal/count-earlier-copies';
import { countOccurrences } from './internal/count-occurrences';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const sliceForLevel = (
  worldStructures: WorldStructures,
  levelCategories: LevelCategory[],
  index: number,
): Sector[] =>
  pipe(
    levelCategories[index],
    (levelCategory) => ({
      structures: worldStructures[levelCategory],
      levelCategory,
    }),
    ({ structures, levelCategory }) => ({
      structures,
      perLevel: floor(
        size(structures) / countOccurrences(levelCategories, levelCategory),
      ),
      shareIndex: countEarlierCopies(levelCategories, index),
    }),
    ({ structures, perLevel, shareIndex }) =>
      slice(structures, shareIndex * perLevel, (shareIndex + 1) * perLevel),
  );
