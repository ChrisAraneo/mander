import type { createRandom } from '@mander/utils';
import type { Sky } from './sky';

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

export const rollSky = (random: ReturnType<typeof createRandom>): Sky => ({
  hue: random.pick(SKY_HUES),
  glowHue: random.pick(GLOW_HUES),
  saturation: random.rollInt(SKY_SATURATION_MIN, SKY_SATURATION_MAX),
  glowSaturation: random.rollInt(GLOW_SATURATION_MIN, GLOW_SATURATION_MAX),
  topLightness: random.rollInt(SKY_TOP_LIGHTNESS_MIN, SKY_TOP_LIGHTNESS_MAX),
});
