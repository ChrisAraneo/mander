import type { Random } from '@mander/engine';
import type { Palette } from '@mander/render';

export interface WorldPalette {
  name: string;
  palette: Palette;
  random: Random;
}
