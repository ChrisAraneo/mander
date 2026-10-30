import { type Random, takeRandom, createRandomInt } from '@mander/engine';
import type { Season } from '@mander/model';
import { toWrappedHue } from '@mander/render';
import { computeHueAwayFromEntity } from './compute-hue-away-from-entity';
import type { PaletteGround } from './types/palette-ground';

const SPRING_GROUND_HUES = [
  50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 112, 120, 128, 136, 144, 152,
];

const SPRING_CAP_HUES = [
  58, 64, 70, 76, 82, 88, 94, 100, 108, 116, 124, 132, 140, 148,
];

const AUTUMN_GROUND_HUES = [344, 350, 356, 2, 8, 14, 20, 26, 32, 38, 44, 50];

const AUTUMN_CAP_HUES = [56, 60, 64, 68, 336, 342, 348, 352];

const GROUND_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_GROUND_HUES,
  AUTUMN: AUTUMN_GROUND_HUES,
});

const CAP_HUES: Readonly<Record<Season, number[]>> = Object.freeze({
  SPRING: SPRING_CAP_HUES,
  AUTUMN: AUTUMN_CAP_HUES,
});

const GROUND_SATURATION_MIN = 18;

const GROUND_SATURATION_MAX = 30;

const GROUND_LIGHTNESS_MIN = 28;

const GROUND_LIGHTNESS_MAX = 36;

const CAP_SATURATION_MIN = 34;

const CAP_SATURATION_MAX = 50;

const CAP_LIGHTNESS_MIN = 44;

const CAP_LIGHTNESS_MAX = 54;

export const createRandomGround = (
  season: Season,
  random: Random,
): PaletteGround => ({
  hue: takeRandom(GROUND_HUES[season], random),
  saturation: createRandomInt(
    GROUND_SATURATION_MIN,
    GROUND_SATURATION_MAX,
    random,
  ),
  lightness: createRandomInt(
    GROUND_LIGHTNESS_MIN,
    GROUND_LIGHTNESS_MAX,
    random,
  ),
  capHue: computeHueAwayFromEntity(
    toWrappedHue(takeRandom(CAP_HUES[season], random)),
  ),
  capSaturation: createRandomInt(
    CAP_SATURATION_MIN,
    CAP_SATURATION_MAX,
    random,
  ),
  capLightness: createRandomInt(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX, random),
});
