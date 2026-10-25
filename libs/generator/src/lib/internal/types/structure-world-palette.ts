import type { Random } from '@mander/engine';
import type { Palette } from '@mander/render';
import type { StructureChoice } from '../../types/structure-choice';

export interface StructureWorldPalette {
  choice: StructureChoice;
  palette: Palette;
  random: Random;
}
