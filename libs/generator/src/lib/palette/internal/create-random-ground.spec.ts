import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { toWrappedHue } from '@mander/render';
import { every, map, size, some, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { ENTITY_HUE } from '../../consts';
import { createRandomGround } from './create-random-ground';
import type { PaletteGround } from './types/palette-ground';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const YELLOW_HUE = 50;

const GREEN_HUE = 152;

const GOLD_HUE = 68;

const WINE_HUE = 336;

const SUN_HUE = 70;

const PINK_HUE = 316;

const CYAN_HUE = 186;

const VIOLET_HUE = 292;

const createGrounds = (season: Season): PaletteGround[] =>
  times(200, (day) => createRandomGround(season, createRandom(`WORLD-${day}`)));

const SPRING_GROUNDS = createGrounds(SPRING);

const SUMMER_GROUNDS = createGrounds(SUMMER);

const AUTUMN_GROUNDS = createGrounds(AUTUMN);

const WINTER_GROUNDS = createGrounds(WINTER);

const GROUNDS = [
  ...SPRING_GROUNDS,
  ...SUMMER_GROUNDS,
  ...AUTUMN_GROUNDS,
  ...WINTER_GROUNDS,
];

const isGrowing = (hue: number): boolean =>
  hue >= YELLOW_HUE && hue <= GREEN_HUE;

const isBurning = (hue: number): boolean => hue <= SUN_HUE || hue >= PINK_HUE;

const isFalling = (hue: number): boolean => hue <= GOLD_HUE || hue >= WINE_HUE;

const isFreezing = (hue: number): boolean =>
  hue >= CYAN_HUE && hue <= VIOLET_HUE;

describe('createRandomGround', () => {
  it('should pick the same ground when the generator starts from the same seed', () => {
    expect(createRandomGround(SPRING, createRandom('WORLD-1'))).toEqual(
      createRandomGround(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other grounds when the seeds differ', () => {
    expect(size(uniq(map(SPRING_GROUNDS, 'hue')))).toBeGreaterThan(1);
    expect(size(uniq(map(SUMMER_GROUNDS, 'hue')))).toBeGreaterThan(1);
    expect(size(uniq(map(AUTUMN_GROUNDS, 'hue')))).toBeGreaterThan(1);
    expect(size(uniq(map(WINTER_GROUNDS, 'hue')))).toBeGreaterThan(1);
  });

  it('should pick another ground when the season turns', () => {
    expect(createRandomGround(SPRING, createRandom('WORLD-1'))).not.toEqual(
      createRandomGround(SUMMER, createRandom('WORLD-1')),
    );
    expect(createRandomGround(SUMMER, createRandom('WORLD-1'))).not.toEqual(
      createRandomGround(AUTUMN, createRandom('WORLD-1')),
    );
    expect(createRandomGround(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      createRandomGround(WINTER, createRandom('WORLD-1')),
    );
  });

  it('should lay down nothing but green, lime and yellow earth when the season is spring', () => {
    expect(every(SPRING_GROUNDS, ({ hue }) => isGrowing(hue))).toBe(true);
  });

  it('should grow nothing but green, lime and yellow on the caps when the season is spring', () => {
    expect(every(SPRING_GROUNDS, ({ capHue }) => isGrowing(capHue))).toBe(true);
  });

  it('should leave the red and the orange out of the ground when the season is spring', () => {
    expect(
      every(
        SPRING_GROUNDS,
        ({ hue, capHue }) => hue >= YELLOW_HUE && capHue >= YELLOW_HUE,
      ),
    ).toBe(true);
  });

  it('should leave the blue and the violet out of the ground when the season is spring', () => {
    expect(
      every(
        SPRING_GROUNDS,
        ({ hue, capHue }) => hue <= GREEN_HUE && capHue <= GREEN_HUE,
      ),
    ).toBe(true);
  });

  it('should bake the earth yellow, gold, orange and pink when the season is summer', () => {
    expect(every(SUMMER_GROUNDS, ({ hue }) => isBurning(hue))).toBe(true);
  });

  it('should burn the caps yellow, gold and pink when the season is summer', () => {
    expect(every(SUMMER_GROUNDS, ({ capHue }) => isBurning(capHue))).toBe(true);
  });

  it('should leave the green, the blue and the violet out of the ground when the season is summer', () => {
    expect(
      every(
        SUMMER_GROUNDS,
        ({ hue, capHue }) =>
          !(hue > SUN_HUE && hue < PINK_HUE) &&
          !(capHue > SUN_HUE && capHue < PINK_HUE),
      ),
    ).toBe(true);
  });

  it('should lay down nothing but red, orange and gold earth when the season is autumn', () => {
    expect(every(AUTUMN_GROUNDS, ({ hue }) => isFalling(hue))).toBe(true);
  });

  it('should turn the caps red, wine and gold when the season is autumn', () => {
    expect(every(AUTUMN_GROUNDS, ({ capHue }) => isFalling(capHue))).toBe(true);
  });

  it('should leave the green, the blue and the violet out of the ground when the season is autumn', () => {
    expect(
      every(
        AUTUMN_GROUNDS,
        ({ hue, capHue }) =>
          !(hue > GOLD_HUE && hue < WINE_HUE) &&
          !(capHue > GOLD_HUE && capHue < WINE_HUE),
      ),
    ).toBe(true);
  });

  it('should freeze the earth cyan, blue and violet when the season is winter', () => {
    expect(every(WINTER_GROUNDS, ({ hue }) => isFreezing(hue))).toBe(true);
  });

  it('should lay the caps in cyan, blue and violet snow when the season is winter', () => {
    expect(every(WINTER_GROUNDS, ({ capHue }) => isFreezing(capHue))).toBe(
      true,
    );
  });

  it('should leave the green, the gold and the red out of the ground when the season is winter', () => {
    expect(
      every(
        WINTER_GROUNDS,
        ({ hue, capHue }) =>
          hue > GREEN_HUE && capHue > GREEN_HUE && hue < WINE_HUE,
      ),
    ).toBe(true);
  });

  it('should keep the ground and its cap between their shades when the season is spring', () => {
    expect(
      every(
        SPRING_GROUNDS,
        ({ saturation, lightness, capSaturation, capLightness }) =>
          saturation >= 18 &&
          saturation <= 30 &&
          lightness >= 28 &&
          lightness <= 36 &&
          capSaturation >= 34 &&
          capSaturation <= 50 &&
          capLightness >= 44 &&
          capLightness <= 54,
      ),
    ).toBe(true);
  });

  it('should keep the ground and its cap bright when the season is summer', () => {
    expect(
      every(
        SUMMER_GROUNDS,
        ({ saturation, lightness, capSaturation, capLightness }) =>
          saturation >= 40 &&
          saturation <= 56 &&
          lightness >= 38 &&
          lightness <= 48 &&
          capSaturation >= 56 &&
          capSaturation <= 72 &&
          capLightness >= 56 &&
          capLightness <= 66,
      ),
    ).toBe(true);
  });

  it('should keep the ground and its cap dark when the season is autumn', () => {
    expect(
      every(
        AUTUMN_GROUNDS,
        ({ saturation, lightness, capSaturation, capLightness }) =>
          saturation >= 0 &&
          saturation <= 30 &&
          lightness >= 14 &&
          lightness <= 36 &&
          capSaturation >= 0 &&
          capSaturation <= 50 &&
          capLightness >= 38 &&
          capLightness <= 54,
      ),
    ).toBe(true);
  });

  it('should wash the colour out of some grounds and leave them grey when the season is autumn', () => {
    expect(some(AUTUMN_GROUNDS, ({ saturation }) => saturation <= 4)).toBe(
      true,
    );
    expect(
      some(AUTUMN_GROUNDS, ({ capSaturation }) => capSaturation <= 4),
    ).toBe(true);
  });

  it('should sink some grounds to nearly black when the season is autumn', () => {
    expect(some(AUTUMN_GROUNDS, ({ lightness }) => lightness <= 18)).toBe(true);
  });

  it('should drain the colour out of the earth when the season is winter', () => {
    expect(
      every(
        WINTER_GROUNDS,
        ({ saturation, lightness }) =>
          saturation >= 14 &&
          saturation <= 24 &&
          lightness >= 30 &&
          lightness <= 38,
      ),
    ).toBe(true);
  });

  it('should lay the snow on the caps almost white when the season is winter', () => {
    expect(
      every(
        WINTER_GROUNDS,
        ({ capSaturation, capLightness }) =>
          capSaturation >= 12 &&
          capSaturation <= 24 &&
          capLightness >= 74 &&
          capLightness <= 84,
      ),
    ).toBe(true);
  });

  it('should keep every cap lighter than the earth under it when it picks many grounds', () => {
    expect(
      every(GROUNDS, ({ lightness, capLightness }) => capLightness > lightness),
    ).toBe(true);
  });

  it('should keep the cap hue away from the hue of the player and the enemies when it picks many grounds', () => {
    expect(
      every(GROUNDS, ({ capHue }) =>
        pipe(
          capHue - ENTITY_HUE,
          toWrappedHue,
          (gap) => gap >= 30 && gap <= 330,
        ),
      ),
    ).toBe(true);
  });
});
