import type { RenderedWorld } from '@mander/render';
import { times } from 'lodash-es';
import { LEVELS_PER_DAY } from '../consts';
import { createLevelFromStructures } from '../level/create-level-from-structures';
import { sliceForLevel } from '../world/slice-for-level';
import type { WorldDrawnStructures } from './types/world-drawn-structures';

export const createWorldLevels = ({
  name,
  season,
  palette,
  levelVariants,
  levelCategories,
  worldStructures,
  random,
}: WorldDrawnStructures): RenderedWorld => ({
  name,
  season,
  levels: times(LEVELS_PER_DAY, (index) =>
    createLevelFromStructures(
      index + 1,
      levelVariants[index],
      sliceForLevel(worldStructures, levelCategories, index),
      random,
    ),
  ),
  palette,
  score: 0,
});
