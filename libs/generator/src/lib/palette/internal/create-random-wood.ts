import { type Random, takeRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING_WOOD_TONES: PaletteMaterialTone[] = [
  { hue: 16, saturation: 40, lightness: 42 },
  { hue: 20, saturation: 36, lightness: 44 },
  { hue: 26, saturation: 30, lightness: 48 },
  { hue: 28, saturation: 10, lightness: 46 },
  { hue: 30, saturation: 6, lightness: 52 },
  { hue: 30, saturation: 32, lightness: 46 },
  { hue: 32, saturation: 38, lightness: 44 },
  { hue: 34, saturation: 14, lightness: 50 },
  { hue: 36, saturation: 26, lightness: 52 },
  { hue: 38, saturation: 34, lightness: 50 },
  { hue: 40, saturation: 30, lightness: 58 },
  { hue: 44, saturation: 24, lightness: 54 },
  { hue: 48, saturation: 20, lightness: 48 },
  { hue: 52, saturation: 18, lightness: 56 },
];

const AUTUMN_WOOD_TONES: PaletteMaterialTone[] = [
  { hue: 6, saturation: 34, lightness: 32 },
  { hue: 10, saturation: 30, lightness: 36 },
  { hue: 14, saturation: 36, lightness: 36 },
  { hue: 18, saturation: 38, lightness: 40 },
  { hue: 22, saturation: 44, lightness: 38 },
  { hue: 24, saturation: 32, lightness: 34 },
  { hue: 26, saturation: 16, lightness: 30 },
  { hue: 28, saturation: 8, lightness: 26 },
  { hue: 28, saturation: 34, lightness: 38 },
  { hue: 30, saturation: 24, lightness: 32 },
  { hue: 32, saturation: 12, lightness: 38 },
  { hue: 34, saturation: 28, lightness: 40 },
  { hue: 38, saturation: 22, lightness: 36 },
  { hue: 44, saturation: 20, lightness: 34 },
];

const WINTER_WOOD_TONES: PaletteMaterialTone[] = [
  { hue: 10, saturation: 10, lightness: 62 },
  { hue: 14, saturation: 6, lightness: 66 },
  { hue: 18, saturation: 14, lightness: 60 },
  { hue: 20, saturation: 8, lightness: 70 },
  { hue: 24, saturation: 12, lightness: 64 },
  { hue: 26, saturation: 4, lightness: 72 },
  { hue: 28, saturation: 16, lightness: 58 },
  { hue: 30, saturation: 10, lightness: 68 },
  { hue: 34, saturation: 6, lightness: 74 },
  { hue: 36, saturation: 14, lightness: 62 },
  { hue: 40, saturation: 8, lightness: 70 },
  { hue: 44, saturation: 12, lightness: 66 },
  { hue: 48, saturation: 6, lightness: 72 },
  { hue: 52, saturation: 10, lightness: 64 },
];

const WOOD_TONES: Readonly<Record<Season, PaletteMaterialTone[]>> =
  Object.freeze({
    SPRING: SPRING_WOOD_TONES,
    AUTUMN: AUTUMN_WOOD_TONES,
    WINTER: WINTER_WOOD_TONES,
  });

export const createRandomWood = (
  season: Season,
  random: Random,
): PaletteMaterialTone => ({ ...takeRandom(WOOD_TONES[season], random) });
