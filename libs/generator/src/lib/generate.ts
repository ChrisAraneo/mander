import { createRandom } from '@mander/engine';
import { chain } from '@mander/model';
import type { RenderedWorld } from '@mander/render';
import { flow } from 'lodash-es';
import { createWorldLevelVariants } from './internal/create-world-level-variants';
import { createWorldLevels } from './internal/create-world-levels';
import { createWorldPalette } from './internal/create-world-palette';
import { takeRandomWorldStructures } from './internal/take-random-world-structures';
import { computeWorldName } from './seed/compute-world-name';

export const generate = (date: Date): RenderedWorld =>
  chain(computeWorldName(date))
    .thru((name) =>
      flow(
        createWorldPalette,
        createWorldLevelVariants,
        takeRandomWorldStructures,
        createWorldLevels,
      )({ name, random: createRandom(name) }),
    )
    .value();
