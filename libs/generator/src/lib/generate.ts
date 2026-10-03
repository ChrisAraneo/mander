import type { RenderedWorld } from '@mander/render';
import { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { LEVELS_PER_DAY } from './consts';
import { generateLevel } from './level/generate-level';
import { generatePalette } from './palette/generate-palette';
import { computeWorldName } from './seed/compute-world-name';
import { getLevelCategories } from './world/get-level-categories';
import { pickRandomWorldStructures } from './world/pick-random-world-structures';
import { sliceForLevel } from './world/slice-for-level';

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const random = createRandom(worldName);
  const palette = generatePalette(random);
  const levelCategories = getLevelCategories(LEVELS_PER_DAY);
  const worldStructures = pickRandomWorldStructures(levelCategories, random);

  return {
    name: worldName,
    levels: times(LEVELS_PER_DAY, (index) =>
      generateLevel(
        index + 1,
        sliceForLevel(worldStructures, levelCategories, index),
        random,
      ),
    ),
    palette,
    score: 0,
  };
};
