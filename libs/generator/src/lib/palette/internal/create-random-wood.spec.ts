import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandomWood } from './create-random-wood';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING: Season = 'SPRING';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const TIMBER_HUE_MIN = 6;

const TIMBER_HUE_MAX = 52;

const createPlanks = (season: Season): PaletteMaterialTone[] =>
  times(200, (day) => createRandomWood(season, createRandom(`WORLD-${day}`)));

const SPRING_PLANKS = createPlanks(SPRING);

const AUTUMN_PLANKS = createPlanks(AUTUMN);

const WINTER_PLANKS = createPlanks(WINTER);

const PLANKS = [...SPRING_PLANKS, ...AUTUMN_PLANKS, ...WINTER_PLANKS];

describe('createRandomWood', () => {
  it('should pick the same wood when the generator starts from the same seed', () => {
    expect(createRandomWood(SPRING, createRandom('WORLD-1'))).toEqual(
      createRandomWood(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other woods when the seeds differ', () => {
    expect(size(uniq(map(SPRING_PLANKS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(AUTUMN_PLANKS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(WINTER_PLANKS, 'hue')))).toBeGreaterThan(8);
  });

  it('should pick another wood when the season turns', () => {
    expect(createRandomWood(SPRING, createRandom('WORLD-1'))).not.toEqual(
      createRandomWood(AUTUMN, createRandom('WORLD-1')),
    );
    expect(createRandomWood(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      createRandomWood(WINTER, createRandom('WORLD-1')),
    );
  });

  it('should cut every plank out of timber when it picks many woods', () => {
    expect(
      every(
        PLANKS,
        ({ hue }) => hue >= TIMBER_HUE_MIN && hue <= TIMBER_HUE_MAX,
      ),
    ).toBe(true);
  });

  it('should cut the planks from pale timber when the season is spring', () => {
    expect(
      every(
        SPRING_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= 6 && saturation <= 40 && lightness >= 42,
      ),
    ).toBe(true);
  });

  it('should cut the planks from aged timber when the season is autumn', () => {
    expect(
      every(
        AUTUMN_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= 8 && saturation <= 44 && lightness <= 40,
      ),
    ).toBe(true);
  });

  it('should bleach the planks with frost when the season is winter', () => {
    expect(
      every(
        WINTER_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= 4 && saturation <= 16 && lightness >= 58,
      ),
    ).toBe(true);
  });

  it('should weather some planks grey and leave others rich when it picks many woods', () => {
    expect(size(uniq(map(PLANKS, 'saturation')))).toBeGreaterThan(10);
  });
});
