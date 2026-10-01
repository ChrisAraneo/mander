import type { RenderedWorld } from '@mander/render';
import { map, size } from 'lodash-es';
import { generateLevel } from './level/generate-level';
import { generatePalette } from './palette/generate-palette';
import { computeLevelSeeds } from './seed/compute-level-seeds';
import { computeWorldName } from './seed/compute-world-name';
import { getLevelCategories } from './structures/world/get-level-categories';
import { pickWorldStructures } from './structures/world/pick-world-structures';
import { sliceForLevel } from './structures/world/slice-for-level';

export const generate = (date: Date): RenderedWorld => {
  const worldName = computeWorldName(date);
  const seeds = computeLevelSeeds(date);
  const levelCategories = getLevelCategories(size(seeds));
  const worldStructures = pickWorldStructures(worldName, levelCategories);

  return {
    name: worldName,
    levels: map(seeds, (seed, index) =>
      generateLevel(
        seed,
        index + 1,
        sliceForLevel(worldStructures, levelCategories, index),
      ),
    ),
    palette: generatePalette(worldName),
    score: 0,
  };
};
