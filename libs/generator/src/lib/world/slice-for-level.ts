import type { Sector } from '@mander/structures';
import { chain } from '@mander/utils';
import { floor, size, slice } from 'lodash-es';
import { countEarlierCopies } from './internal/count-earlier-copies';
import { countOccurrences } from './internal/count-occurrences';
import type { LevelCategory } from './types/level-category';
import type { WorldStructures } from './types/world-structures';

export const sliceForLevel = (
  worldStructures: WorldStructures,
  levelCategories: LevelCategory[],
  index: number,
): Sector[] =>
  chain(levelCategories[index])
    .thru((levelCategory) => ({
      structures: worldStructures[levelCategory],
      levelCategory,
    }))
    .thru(({ structures, levelCategory }) => ({
      structures,
      perLevel: floor(
        size(structures) / countOccurrences(levelCategories, levelCategory),
      ),
      shareIndex: countEarlierCopies(levelCategories, index),
    }))
    .thru(({ structures, perLevel, shareIndex }) =>
      slice(structures, shareIndex * perLevel, (shareIndex + 1) * perLevel),
    )
    .value();
