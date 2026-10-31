import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { every, map, size, some, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandomCeramic } from './create-random-ceramic';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const GLAZE_HUE_MIN = 128;

const GLAZE_HUE_MAX = 330;

const HOT_HUE_MIN = 288;

const ICE_HUE_MIN = 174;

const ICE_HUE_MAX = 294;

const createPots = (season: Season): PaletteMaterialTone[] =>
  times(200, (day) =>
    createRandomCeramic(season, createRandom(`WORLD-${day}`)),
  );

const SPRING_POTS = createPots(SPRING);

const SUMMER_POTS = createPots(SUMMER);

const AUTUMN_POTS = createPots(AUTUMN);

const WINTER_POTS = createPots(WINTER);

const POTS = [...SPRING_POTS, ...SUMMER_POTS, ...AUTUMN_POTS, ...WINTER_POTS];

describe('createRandomCeramic', () => {
  it('should pick the same ceramic when the generator starts from the same seed', () => {
    expect(createRandomCeramic(SPRING, createRandom('WORLD-1'))).toEqual(
      createRandomCeramic(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other ceramics when the seeds differ', () => {
    expect(size(uniq(map(SPRING_POTS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(SUMMER_POTS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(AUTUMN_POTS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(WINTER_POTS, 'hue')))).toBeGreaterThan(8);
  });

  it('should pick another ceramic when the season turns', () => {
    expect(createRandomCeramic(SPRING, createRandom('WORLD-1'))).not.toEqual(
      createRandomCeramic(SUMMER, createRandom('WORLD-1')),
    );
    expect(createRandomCeramic(SUMMER, createRandom('WORLD-1'))).not.toEqual(
      createRandomCeramic(AUTUMN, createRandom('WORLD-1')),
    );
    expect(createRandomCeramic(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      createRandomCeramic(WINTER, createRandom('WORLD-1')),
    );
  });

  it('should glaze every pot away from the earth when it picks many ceramics', () => {
    expect(
      every(POTS, ({ hue }) => hue >= GLAZE_HUE_MIN && hue <= GLAZE_HUE_MAX),
    ).toBe(true);
  });

  it('should keep the glaze on every pot when it picks many ceramics', () => {
    expect(every(POTS, ({ saturation }) => saturation >= 30)).toBe(true);
  });

  it('should glaze the pots fresh and bright when the season is spring', () => {
    expect(
      every(
        SPRING_POTS,
        ({ saturation, lightness }) =>
          saturation >= 36 && saturation <= 58 && lightness >= 44,
      ),
    ).toBe(true);
  });

  it('should glaze the pots hot pink and magenta when the season is summer', () => {
    expect(
      every(
        SUMMER_POTS,
        ({ hue }) => hue >= HOT_HUE_MIN && hue <= GLAZE_HUE_MAX,
      ),
    ).toBe(true);
  });

  it('should glaze the pots bright when the season is summer', () => {
    expect(
      every(
        SUMMER_POTS,
        ({ saturation, lightness }) =>
          saturation >= 54 && saturation <= 74 && lightness >= 56,
      ),
    ).toBe(true);
  });

  it('should glaze the pots deep when the season is autumn', () => {
    expect(
      every(
        AUTUMN_POTS,
        ({ saturation, lightness }) =>
          saturation >= 30 && saturation <= 52 && lightness <= 44,
      ),
    ).toBe(true);
  });

  it('should sink some pots into the dark when the season is autumn', () => {
    expect(some(AUTUMN_POTS, ({ lightness }) => lightness <= 30)).toBe(true);
  });

  it('should glaze the pots cyan, blue and violet when the season is winter', () => {
    expect(
      every(WINTER_POTS, ({ hue }) => hue >= ICE_HUE_MIN && hue <= ICE_HUE_MAX),
    ).toBe(true);
  });

  it('should glaze the pots in ice when the season is winter', () => {
    expect(
      every(
        WINTER_POTS,
        ({ saturation, lightness }) =>
          saturation >= 38 && saturation <= 56 && lightness >= 60,
      ),
    ).toBe(true);
  });
});
