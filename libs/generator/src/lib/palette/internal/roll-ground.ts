import { type createRandom, wrapHue } from '@mander/utils';
import type { Ground } from './ground';
import { pushAwayFromEntityHue } from './push-away-from-entity-hue';

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

export const rollGround = (
  random: ReturnType<typeof createRandom>,
): Ground => ({
  hue: random.pick(GROUND_HUES),
  saturation: random.rollInt(GROUND_SATURATION_MIN, GROUND_SATURATION_MAX),
  lightness: random.rollInt(GROUND_LIGHTNESS_MIN, GROUND_LIGHTNESS_MAX),
  capHue: pushAwayFromEntityHue(wrapHue(random.pick(CAP_HUES))),
  capSaturation: random.rollInt(CAP_SATURATION_MIN, CAP_SATURATION_MAX),
  capLightness: random.rollInt(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX),
});
