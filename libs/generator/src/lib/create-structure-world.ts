import { createRandom } from '@mander/engine';
import type { RenderedWorld } from '@mander/render';
import { pipe } from 'remeda';
import { createStructureWorldLevels } from './internal/create-structure-world-levels';
import { createStructureWorldPalette } from './internal/create-structure-world-palette';
import type { StructureChoice } from './types/structure-choice';

export const createStructureWorld = (choice: StructureChoice): RenderedWorld =>
  pipe(
    { choice, random: createRandom(choice.name) },
    createStructureWorldPalette,
    createStructureWorldLevels,
  );
