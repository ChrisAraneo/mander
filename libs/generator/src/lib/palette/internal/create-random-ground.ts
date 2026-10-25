import { type Random, takeRandom, createRandomInt } from '@mander/engine';
import { toWrappedHue } from '@mander/render';
import { computeHueAwayFromEntity } from './compute-hue-away-from-entity';
import type { PaletteGround } from './types/palette-ground';

const GROUND_HUES = [
  26, 32, 38, 44, 18, 52, 70, 90, 350, 330, 4, 12, 22, 48, 58, 80, 100, 116,
  340, 314,
];

const CAP_HUES = [
  58, 66, 78, 92, 108, 128, 316, 336, 72, 85, 100, 116, 140, 152, 300, 346,
];

const GROUND_SATURATION_MIN = 18;

const GROUND_SATURATION_MAX = 30;

const GROUND_LIGHTNESS_MIN = 28;

const GROUND_LIGHTNESS_MAX = 36;

const CAP_SATURATION_MIN = 34;

const CAP_SATURATION_MAX = 50;

const CAP_LIGHTNESS_MIN = 44;

const CAP_LIGHTNESS_MAX = 54;

export const createRandomGround = (random: Random): PaletteGround => ({
  hue: takeRandom(GROUND_HUES, random),
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
  capHue: computeHueAwayFromEntity(toWrappedHue(takeRandom(CAP_HUES, random))),
  capSaturation: createRandomInt(
    CAP_SATURATION_MIN,
    CAP_SATURATION_MAX,
    random,
  ),
  capLightness: createRandomInt(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX, random),
});
