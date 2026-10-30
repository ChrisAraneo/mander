import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { toWrappedHue } from '@mander/render';
import { every, map, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { ENTITY_HUE } from '../../consts';
import { createRandomGround } from './create-random-ground';
import type { PaletteGround } from './types/palette-ground';

const SPRING: Season = 'SPRING';

const AUTUMN: Season = 'AUTUMN';

const YELLOW_HUE = 50;

const GREEN_HUE = 152;

const GOLD_HUE = 68;

const WINE_HUE = 336;

const createGrounds = (season: Season): PaletteGround[] =>
  times(200, (day) => createRandomGround(season, createRandom(`WORLD-${day}`)));

const SPRING_GROUNDS = createGrounds(SPRING);

const AUTUMN_GROUNDS = createGrounds(AUTUMN);

const GROUNDS = [...SPRING_GROUNDS, ...AUTUMN_GROUNDS];

const isGrowing = (hue: number): boolean =>
  hue >= YELLOW_HUE && hue <= GREEN_HUE;

const isFalling = (hue: number): boolean => hue <= GOLD_HUE || hue >= WINE_HUE;

describe('createRandomGround', () => {
  it('should pick the same ground when the generator starts from the same seed', () => {
    expect(createRandomGround(SPRING, createRandom('WORLD-1'))).toEqual(
      createRandomGround(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other grounds when the seeds differ', () => {
    expect(size(uniq(map(SPRING_GROUNDS, 'hue')))).toBeGreaterThan(1);
    expect(size(uniq(map(AUTUMN_GROUNDS, 'hue')))).toBeGreaterThan(1);
  });

  it('should pick another ground when the season turns', () => {
    expect(createRandomGround(SPRING, createRandom('WORLD-1'))).not.toEqual(
      createRandomGround(AUTUMN, createRandom('WORLD-1')),
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

  it('should keep the ground between its lowest and highest shades when it picks many grounds', () => {
    expect(
      every(
        GROUNDS,
        ({ saturation, lightness }) =>
          saturation >= 18 &&
          saturation <= 30 &&
          lightness >= 28 &&
          lightness <= 36,
      ),
    ).toBe(true);
  });

  it('should keep the cap between its lowest and highest shades when it picks many grounds', () => {
    expect(
      every(
        GROUNDS,
        ({ capSaturation, capLightness }) =>
          capSaturation >= 34 &&
          capSaturation <= 50 &&
          capLightness >= 44 &&
          capLightness <= 54,
      ),
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
