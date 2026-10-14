import type { Palette } from '@mander/render';
import type { createRandom } from '@mander/utils';

export interface WorldPalette {
  name: string;
  palette: Palette;
  random: ReturnType<typeof createRandom>;
}
