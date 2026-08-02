import type { Palette } from '@mander/render';
import { createRandom, type Hsl, hslCss, wrapHue } from '@mander/utils';
import { match } from 'ts-pattern';

const HUE_MAX = 359;

/**
 * The sky is rolled dark and only lightly coloured: it sits behind everything
 * the player has to read, so it carries the level's hue without competing for
 * attention. The three stops run top, middle, horizon, brightening downward.
 */
const SKY_SATURATION_MIN = 18;
const SKY_SATURATION_MAX = 46;
const SKY_TOP_LIGHTNESS_MIN = 10;
const SKY_TOP_LIGHTNESS_MAX = 17;
const SKY_MIDDLE_LIGHTNESS_GAIN = 10;
const SKY_HORIZON_LIGHTNESS_GAIN = 16;
const SKY_HORIZON_HUE_DRIFT = 16;

/** Hills are the sky again, a shade greyer and a shade lighter. */
const HILL_SATURATION_DROP = 4;
const FAR_HILL_LIGHTNESS_GAIN = 6;
const NEAR_HILL_LIGHTNESS_GAIN = 2;

const GROUND_SATURATION_MIN = 16;
const GROUND_SATURATION_MAX = 44;
const GROUND_LIGHTNESS_MIN = 22;
const GROUND_LIGHTNESS_MAX = 32;

/**
 * The cap is the grass on top of the dirt, rolled well away from the body of
 * the block so the surface the player runs along stands out from what is
 * underneath it.
 */
const CAP_HUE_OFFSET_MIN = 45;
const CAP_HUE_OFFSET_MAX = 150;
const CAP_SATURATION_MIN = 30;
const CAP_SATURATION_MAX = 52;
const CAP_LIGHTNESS_MIN = 44;
const CAP_LIGHTNESS_MAX = 56;
const CAP_HIGHLIGHT_SATURATION_GAIN = 5;
const CAP_HIGHLIGHT_LIGHTNESS_GAIN = 6;

/** The hue the player and the enemies are drawn in, and the berth to give it. */
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

/**
 * Pushes a hue clear of the one the entities wear. A cap that lands on the
 * player's own colour would hide them against the ground they stand on, so a
 * hue inside the guard is moved out to whichever side of it is nearer.
 */
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
  const hue = random.int(0, HUE_MAX);

  return {
    hue,
    horizonHue: wrapHue(
      hue + random.int(-SKY_HORIZON_HUE_DRIFT, SKY_HORIZON_HUE_DRIFT),
    ),
    saturation: random.int(SKY_SATURATION_MIN, SKY_SATURATION_MAX),
    topLightness: random.int(SKY_TOP_LIGHTNESS_MIN, SKY_TOP_LIGHTNESS_MAX),
  };
};

/**
 * The ground rolls its own hue rather than borrowing the sky's, so a level is
 * two colours meeting rather than one wash over everything.
 */
const rollGround = (random: ReturnType<typeof createRandom>): Ground => {
  const hue = random.int(0, HUE_MAX);

  return {
    hue,
    saturation: random.int(GROUND_SATURATION_MIN, GROUND_SATURATION_MAX),
    lightness: random.int(GROUND_LIGHTNESS_MIN, GROUND_LIGHTNESS_MAX),
    capHue: awayFromEntityHue(
      wrapHue(hue + random.int(CAP_HUE_OFFSET_MIN, CAP_HUE_OFFSET_MAX)),
    ),
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

/**
 * A level's colours, decided by its seed alone — the same seed paints the same
 * level every time. Everything is written in the `HSL(h, s%, l%)` form the
 * renderer reads back, which is what lets the block colour be shifted into the
 * five material tints rather than each one being picked by hand.
 */
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
