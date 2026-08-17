import type { Palette } from '@mander/render';
import { createRandom, type Hsl, hslCss, wrapHue } from '@mander/utils';
import { match } from 'ts-pattern';

import { CAP_HUES, GROUND_HUES, SKY_HUES } from './cel-hues';

/**
 * Everything here is deliberately low-saturation and dark: the picture is
 * lit by the screen stage afterwards, and a cel painted in full-strength
 * colour comes out of the tape looking like a cartoon rather than a print.
 */
const SKY_SATURATION_MIN = 10;
const SKY_SATURATION_MAX = 26;
const SKY_TOP_LIGHTNESS_MIN = 8;
const SKY_TOP_LIGHTNESS_MAX = 14;
const SKY_MIDDLE_LIGHTNESS_GAIN = 8;
const SKY_HORIZON_LIGHTNESS_GAIN = 14;
const SKY_HORIZON_HUE_DRIFT = 12;

const HILL_SATURATION_DROP = 3;
const FAR_HILL_LIGHTNESS_GAIN = 6;
const NEAR_HILL_LIGHTNESS_GAIN = 2;

const GROUND_SATURATION_MIN = 8;
const GROUND_SATURATION_MAX = 22;
const GROUND_LIGHTNESS_MIN = 18;
const GROUND_LIGHTNESS_MAX = 26;

const CAP_SATURATION_MIN = 14;
const CAP_SATURATION_MAX = 30;
const CAP_LIGHTNESS_MIN = 36;
const CAP_LIGHTNESS_MAX = 48;
const CAP_HIGHLIGHT_SATURATION_GAIN = 4;
const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

const ENTITY_HUE = 24;
const ENTITY_HUE_GUARD = 30;

interface Sky {
  hue: number;
  horizonHue: number;
  saturation: number;
  topLightness: number;
}

interface Ground {
  hue: number;
  saturation: number;
  lightness: number;
  capHue: number;
  capSaturation: number;
  capLightness: number;
}

const awayFromEntityHue = (hue: number): number =>
  match(wrapHue(hue - ENTITY_HUE))
    .when(
      (gap) => gap >= ENTITY_HUE_GUARD && gap <= 360 - ENTITY_HUE_GUARD,
      () => hue,
    )
    .when(
      (gap) => gap <= 180,
      () => wrapHue(ENTITY_HUE + ENTITY_HUE_GUARD),
    )
    .otherwise(() => wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD));

const rollSky = (random: ReturnType<typeof createRandom>): Sky => {
  const hue = random.pick(SKY_HUES);

  return {
    hue,
    horizonHue: wrapHue(
      hue + random.int(-SKY_HORIZON_HUE_DRIFT, SKY_HORIZON_HUE_DRIFT),
    ),
    saturation: random.int(SKY_SATURATION_MIN, SKY_SATURATION_MAX),
    topLightness: random.int(SKY_TOP_LIGHTNESS_MIN, SKY_TOP_LIGHTNESS_MAX),
  };
};

const rollGround = (random: ReturnType<typeof createRandom>): Ground => {
  const hue = random.pick(GROUND_HUES);

  return {
    hue,
    saturation: random.int(GROUND_SATURATION_MIN, GROUND_SATURATION_MAX),
    lightness: random.int(GROUND_LIGHTNESS_MIN, GROUND_LIGHTNESS_MAX),
    capHue: awayFromEntityHue(wrapHue(random.pick(CAP_HUES))),
    capSaturation: random.int(CAP_SATURATION_MIN, CAP_SATURATION_MAX),
    capLightness: random.int(CAP_LIGHTNESS_MIN, CAP_LIGHTNESS_MAX),
  };
};

const skyStops = (sky: Sky): readonly [Hsl, Hsl, Hsl] => [
  { hue: sky.hue, saturation: sky.saturation, lightness: sky.topLightness },
  {
    hue: sky.hue,
    saturation: sky.saturation,
    lightness: sky.topLightness + SKY_MIDDLE_LIGHTNESS_GAIN,
  },
  {
    hue: sky.horizonHue,
    saturation: sky.saturation,
    lightness: sky.topLightness + SKY_HORIZON_LIGHTNESS_GAIN,
  },
];

const hillShades = (sky: Sky): readonly [Hsl, Hsl] => [
  {
    hue: sky.hue,
    saturation: sky.saturation - HILL_SATURATION_DROP,
    lightness: sky.topLightness + FAR_HILL_LIGHTNESS_GAIN,
  },
  {
    hue: sky.hue,
    saturation: sky.saturation - HILL_SATURATION_DROP,
    lightness: sky.topLightness + NEAR_HILL_LIGHTNESS_GAIN,
  },
];

export const generatePalette = (seed: string): Palette => {
  const random = createRandom(seed);
  const sky = rollSky(random);
  const ground = rollGround(random);
  const [top, middle, horizon] = skyStops(sky);
  const [far, near] = hillShades(sky);

  return {
    sky: [hslCss(top), hslCss(middle), hslCss(horizon)],
    hills: [hslCss(far), hslCss(near)],
    block: hslCss({
      hue: ground.hue,
      saturation: ground.saturation,
      lightness: ground.lightness,
    }),
    blockCap: hslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation,
      lightness: ground.capLightness,
    }),
    blockCapHighlight: hslCss({
      hue: ground.capHue,
      saturation: ground.capSaturation + CAP_HIGHLIGHT_SATURATION_GAIN,
      lightness: ground.capLightness + CAP_HIGHLIGHT_LIGHTNESS_GAIN,
    }),
  };
};
