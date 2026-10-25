import type { Random } from '@mander/engine';
import { createPalette } from '../palette/create-palette';
import type { StructureChoice } from '../types/structure-choice';
import type { StructureWorldPalette } from './types/structure-world-palette';

export const createStructureWorldPalette = ({
  choice,
  random,
}: {
  choice: StructureChoice;
  random: Random;
}): StructureWorldPalette => ({
  choice,
  palette: createPalette(random),
  random,
});
