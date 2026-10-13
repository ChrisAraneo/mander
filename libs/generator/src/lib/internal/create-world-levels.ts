import { times } from 'lodash-es';
import { LEVELS_PER_DAY } from '../consts';
import { createLevelFromStructures } from '../level/create-level-from-structures';
import { sliceForLevel } from '../world/slice-for-level';
import type { takeRandomWorldStructures } from './take-random-world-structures';

export const createWorldLevels = ({
  name,
  palette,
  levelCategories,
  worldStructures,
  random,
}: ReturnType<typeof takeRandomWorldStructures>) => ({
  name,
  levels: times(LEVELS_PER_DAY, (index) =>
    createLevelFromStructures(
      index + 1,
      sliceForLevel(worldStructures, levelCategories, index),
      random,
    ),
  ),
  palette,
  score: 0,
});
