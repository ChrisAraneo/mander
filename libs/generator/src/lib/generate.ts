import type { RenderedWorld } from '@mander/render';
import { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { LEVELS_PER_DAY } from './consts';
import { generateLevel } from './level/generate-level';
import { generatePalette } from './palette/generate-palette';
import { computeWorldName } from './seed/compute-world-name';
import { getLevelCategories } from './structures/world/get-level-categories';
import { pickWorldStructures } from './structures/world/pick-world-structures';
import { sliceForLevel } from './structures/world/slice-for-level';

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const random = createRandom(worldName);
  const palette = generatePalette(random);
  const levelCategories = getLevelCategories(LEVELS_PER_DAY);
  const worldStructures = pickWorldStructures(levelCategories, random);

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
