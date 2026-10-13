import type { RenderedWorld } from '@mander/render';
import { chain, createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import { createWorldLevelCategories } from './internal/create-world-level-categories';
import { createWorldLevels } from './internal/create-world-levels';
import { createWorldPalette } from './internal/create-world-palette';
import { takeRandomWorldStructures } from './internal/take-random-world-structures';
import { computeWorldName } from './seed/compute-world-name';

export const generate = (date: Date): RenderedWorld =>
  chain(computeWorldName(date))
    .thru((name) =>
      flow(
        createWorldPalette,
        createWorldLevelCategories,
        takeRandomWorldStructures,
        createWorldLevels,
      )({ name, random: createRandom(name) }),
    )
    .value();
