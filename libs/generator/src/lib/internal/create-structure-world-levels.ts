import type { RenderedWorld } from '@mander/render';
import { times } from 'lodash-es';
import { LEVELS_PER_DAY, STRUCTURE_WORLD_REPEATS } from '../consts';
import { createLevelFromStructures } from '../level/create-level-from-structures';
import { toStructureLevelVariant } from './to-structure-level-variant';
import type { StructureWorldPalette } from './types/structure-world-palette';

const STRUCTURE_LEVEL_NUMBER = LEVELS_PER_DAY;

export const createStructureWorldLevels = ({
  choice,
  season,
  palette,
  random,
}: StructureWorldPalette): RenderedWorld => ({
  name: choice.name,
  season,
  levels: [
    createLevelFromStructures(
      STRUCTURE_LEVEL_NUMBER,
      toStructureLevelVariant(choice.category),
      times(STRUCTURE_WORLD_REPEATS, () => choice.structure),
      random,
    ),
  ],
  palette,
  score: 0,
});
