import { type Random, takeRandom, createRandomInt } from '@mander/engine';
import type { PaletteSky } from './types/palette-sky';

const SKY_HUES = [
  172, 186, 196, 206, 216, 228, 240, 254, 268, 284, 300, 320, 136, 150, 162,
  191, 201, 222, 247, 261, 276, 292, 310, 336,
];

const GLOW_HUES = [16, 28, 38, 48, 352, 4, 22, 33, 60, 336];

const SKY_SATURATION_MIN = 24;

const SKY_SATURATION_MAX = 38;

const GLOW_SATURATION_MIN = 44;

const GLOW_SATURATION_MAX = 60;

const SKY_TOP_LIGHTNESS_MIN = 26;

const SKY_TOP_LIGHTNESS_MAX = 34;

export const createRandomSky = (random: Random): PaletteSky => ({
  hue: takeRandom(SKY_HUES, random),
  glowHue: takeRandom(GLOW_HUES, random),
  saturation: createRandomInt(SKY_SATURATION_MIN, SKY_SATURATION_MAX, random),
  glowSaturation: createRandomInt(
    GLOW_SATURATION_MIN,
    GLOW_SATURATION_MAX,
    random,
  ),
  topLightness: createRandomInt(
    SKY_TOP_LIGHTNESS_MIN,
    SKY_TOP_LIGHTNESS_MAX,
    random,
  ),
});
