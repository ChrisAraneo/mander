import { createRandom } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import { createWorldLevelVariants } from './internal/create-world-level-variants';
import { createWorldLevels } from './internal/create-world-levels';
import { createWorldPalette } from './internal/create-world-palette';
import { takeRandomWorldStructures } from './internal/take-random-world-structures';
import { computeWorldName } from './seed/compute-world-name';

export const createWorld = (date: Date): RenderedWorld =>
  pipe(
    date,
    computeWorldName,
    (name) => ({ name, random: createRandom(name) }),
    createWorldPalette,
    createWorldLevelVariants,
    takeRandomWorldStructures,
    createWorldLevels,
  );
