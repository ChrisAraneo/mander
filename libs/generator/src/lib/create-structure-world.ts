import { createRandom } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import { createStructureWorldLevels } from './internal/create-structure-world-levels';
import { createStructureWorldPalette } from './internal/create-structure-world-palette';
import type { StructureChoice } from './types/structure-choice';
import { takeRandomSeason } from './world/take-random-season';

export const createStructureWorld = (choice: StructureChoice): RenderedWorld =>
  pipe(
    createRandom(choice.name),
    (random) => ({
      choice,
      season: takeRandomSeason(random),
      random,
    }),
    createStructureWorldPalette,
    createStructureWorldLevels,
  );
