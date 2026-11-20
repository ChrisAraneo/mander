import { type Random, tryTakeRandom, createRandomInt } from '@mander/common';
import type { Season } from '@mander/model';
import { toWrappedHue } from '@mander/render';
import { computeHueAwayFromEntity } from './compute-hue-away-from-entity';
import { GROUND_SHADES } from './consts';
import type { PaletteGround } from './types/palette-ground';
import type { PaletteGroundShades } from './types/palette-ground-shades';
import type { PaletteShadeRange } from './types/palette-shade-range';

const SPRING_GROUND_HUES = [
  50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 112, 120, 128, 136, 144, 152,
];

const SPRING_CAP_HUES = [
  58, 64, 70, 76, 82, 88, 94, 100, 108, 116, 124, 132, 140, 148,
];

const SUMMER_GROUND_HUES = [
  14, 20, 26, 32, 38, 44, 50, 56, 320, 328, 334, 340, 346, 352,
];

const SUMMER_CAP_HUES = [54, 58, 62, 66, 70, 316, 324, 332, 340, 348];

const AUTUMN_GROUND_HUES = [344, 350, 356, 2, 8, 14, 20, 26, 32, 38, 44, 50];

const AUTUMN_CAP_HUES = [56, 60, 64, 68, 336, 342, 348, 352];

const WINTER_GROUND_HUES = [
  186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 248, 256, 264, 272, 282,
  292,
];

const WINTER_CAP_HUES = [
  186, 192, 198, 204, 210, 216, 222, 228, 236, 244, 252, 264, 276, 288,
];

const GROUND_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_GROUND_HUES,
  SUMMER: SUMMER_GROUND_HUES,
  AUTUMN: AUTUMN_GROUND_HUES,
  WINTER: WINTER_GROUND_HUES,
});

const CAP_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_CAP_HUES,
  SUMMER: SUMMER_CAP_HUES,
  AUTUMN: AUTUMN_CAP_HUES,
  WINTER: WINTER_CAP_HUES,
});

const createRandomShade = (
  { min, max }: PaletteShadeRange,
  random: Random,
): number => createRandomInt(min, max, random);

const createRandomGroundOfShades = (
  shades: PaletteGroundShades,
  season: Season,
  random: Random,
): PaletteGround => ({
  hue: tryTakeRandom(GROUND_HUES[season], random),
  saturation: createRandomShade(shades.saturation, random),
  lightness: createRandomShade(shades.lightness, random),
  capHue: computeHueAwayFromEntity(
    toWrappedHue(tryTakeRandom(CAP_HUES[season], random)),
  ),
  capSaturation: createRandomShade(shades.capSaturation, random),
  capLightness: createRandomShade(shades.capLightness, random),
});

export const createRandomGround = (
  season: Season,
  random: Random,
): PaletteGround =>
  createRandomGroundOfShades(GROUND_SHADES[season], season, random);
