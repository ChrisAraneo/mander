import { type Random, takeRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING_BRICK_TONES: PaletteMaterialTone[] = [
  { hue: 4, saturation: 52, lightness: 50 },
  { hue: 8, saturation: 46, lightness: 44 },
  { hue: 10, saturation: 58, lightness: 52 },
  { hue: 12, saturation: 44, lightness: 42 },
  { hue: 14, saturation: 40, lightness: 50 },
  { hue: 18, saturation: 50, lightness: 46 },
  { hue: 22, saturation: 30, lightness: 54 },
  { hue: 24, saturation: 18, lightness: 58 },
  { hue: 28, saturation: 38, lightness: 50 },
  { hue: 32, saturation: 44, lightness: 48 },
  { hue: 38, saturation: 34, lightness: 52 },
  { hue: 44, saturation: 38, lightness: 54 },
  { hue: 348, saturation: 28, lightness: 56 },
  { hue: 356, saturation: 38, lightness: 48 },
];

const AUTUMN_BRICK_TONES: PaletteMaterialTone[] = [
  { hue: 2, saturation: 56, lightness: 42 },
  { hue: 6, saturation: 34, lightness: 36 },
  { hue: 10, saturation: 48, lightness: 38 },
  { hue: 14, saturation: 60, lightness: 38 },
  { hue: 16, saturation: 52, lightness: 40 },
  { hue: 20, saturation: 44, lightness: 40 },
  { hue: 24, saturation: 54, lightness: 42 },
  { hue: 28, saturation: 38, lightness: 30 },
  { hue: 32, saturation: 48, lightness: 44 },
  { hue: 40, saturation: 42, lightness: 42 },
  { hue: 328, saturation: 28, lightness: 32 },
  { hue: 336, saturation: 32, lightness: 38 },
  { hue: 344, saturation: 40, lightness: 36 },
  { hue: 356, saturation: 46, lightness: 34 },
];

const BRICK_TONES: Readonly<Record<Season, PaletteMaterialTone[]>> =
  Object.freeze({
    SPRING: SPRING_BRICK_TONES,
    AUTUMN: AUTUMN_BRICK_TONES,
  });

export const createRandomBrick = (
  season: Season,
  random: Random,
): PaletteMaterialTone => ({ ...takeRandom(BRICK_TONES[season], random) });
