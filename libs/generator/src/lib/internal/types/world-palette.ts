import type { createRandom } from '@mander/engine';
import type { Palette } from '@mander/render';

export interface WorldPalette {
  name: string;
  palette: Palette;
  random: ReturnType<typeof createRandom>;
}
