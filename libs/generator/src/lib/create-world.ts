import { createRandom } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import { createWorldLevelVariants } from './internal/create-world-level-variants';
import { createWorldLevels } from './internal/create-world-levels';
import { createWorldPalette } from './internal/create-world-palette';
import { takeRandomWorldStructures } from './internal/take-random-world-structures';
import { computeWorldName } from './seed/compute-world-name';
import { takeRandomSeason } from './world/take-random-season';

export const createWorld = (date: Date): RenderedWorld =>
  pipe(
    date,
    computeWorldName,
    (name) =>
      pipe(createRandom(name), (random) => ({
        name,
        season: takeRandomSeason(random),
        random,
      })),
    createWorldPalette,
    createWorldLevelVariants,
    takeRandomWorldStructures,
    createWorldLevels,
  );
