import type { Random } from '@mander/engine';
import type { Season } from '@mander/model';
import type { Palette } from '@mander/render';
import type { StructureChoice } from '../../types/structure-choice';

export interface StructureWorldPalette {
  choice: StructureChoice;
  season: Season;
  palette: Palette;
  random: Random;
}
