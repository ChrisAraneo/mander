import { createRandom } from '@mander/common';
import type { Season } from '@mander/model';
import { every, map, size, some, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { takeRandomWood } from './take-random-wood';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const TIMBER_HUE_MIN = 6;

const TIMBER_HUE_MAX = 52;

const SEEDS_TRIED = 200;

const FEWEST_DISTINCT_HUES = 8;

const FEWEST_DISTINCT_SATURATIONS = 10;

const SPRING_SATURATION_MIN = 6;

const SPRING_SATURATION_MAX = 40;

const SPRING_LIGHTNESS_MIN = 42;

const SUMMER_SATURATION_MIN = 30;

const SUMMER_SATURATION_MAX = 56;

const SUMMER_LIGHTNESS_MIN = 52;

const AUTUMN_SATURATION_MIN = 0;

const AUTUMN_SATURATION_MAX = 44;

const AUTUMN_LIGHTNESS_MAX = 40;

const CHARRED_SATURATION_MAX = 6;

const CHARRED_LIGHTNESS_MAX = 28;

const WINTER_SATURATION_MIN = 4;

const WINTER_SATURATION_MAX = 16;

const WINTER_LIGHTNESS_MIN = 58;

const createPlanks = (season: Season): PaletteMaterialTone[] =>
  times(SEEDS_TRIED, (day) =>
    takeRandomWood(season, createRandom(`WORLD-${day}`)),
  );

const SPRING_PLANKS = createPlanks(SPRING);

const SUMMER_PLANKS = createPlanks(SUMMER);

const AUTUMN_PLANKS = createPlanks(AUTUMN);

const WINTER_PLANKS = createPlanks(WINTER);

const PLANKS = [
  ...SPRING_PLANKS,
  ...SUMMER_PLANKS,
  ...AUTUMN_PLANKS,
  ...WINTER_PLANKS,
];

describe('takeRandomWood', () => {
  it('should pick the same wood when the generator starts from the same seed', () => {
    expect(takeRandomWood(SPRING, createRandom('WORLD-1'))).toEqual(
      takeRandomWood(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other woods when the seeds differ', () => {
    expect(size(uniq(map(SPRING_PLANKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(SUMMER_PLANKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(AUTUMN_PLANKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(WINTER_PLANKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
  });

  it('should pick another wood when the season turns', () => {
    expect(takeRandomWood(SPRING, createRandom('WORLD-1'))).not.toEqual(
      takeRandomWood(SUMMER, createRandom('WORLD-1')),
    );
    expect(takeRandomWood(SUMMER, createRandom('WORLD-1'))).not.toEqual(
      takeRandomWood(AUTUMN, createRandom('WORLD-1')),
    );
    expect(takeRandomWood(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      takeRandomWood(WINTER, createRandom('WORLD-1')),
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
          saturation >= SPRING_SATURATION_MIN &&
          saturation <= SPRING_SATURATION_MAX &&
          lightness >= SPRING_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should cut the planks from sunlit timber when the season is summer', () => {
    expect(
      every(
        SUMMER_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= SUMMER_SATURATION_MIN &&
          saturation <= SUMMER_SATURATION_MAX &&
          lightness >= SUMMER_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should cut the planks from aged timber when the season is autumn', () => {
    expect(
      every(
        AUTUMN_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= AUTUMN_SATURATION_MIN &&
          saturation <= AUTUMN_SATURATION_MAX &&
          lightness <= AUTUMN_LIGHTNESS_MAX,
      ),
    ).toBe(true);
  });

  it('should char some planks grey and black when the season is autumn', () => {
    expect(
      some(
        AUTUMN_PLANKS,
        ({ saturation, lightness }) =>
          saturation <= CHARRED_SATURATION_MAX &&
          lightness <= CHARRED_LIGHTNESS_MAX,
      ),
    ).toBe(true);
  });

  it('should bleach the planks with frost when the season is winter', () => {
    expect(
      every(
        WINTER_PLANKS,
        ({ saturation, lightness }) =>
          saturation >= WINTER_SATURATION_MIN &&
          saturation <= WINTER_SATURATION_MAX &&
          lightness >= WINTER_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should weather some planks grey and leave others rich when it picks many woods', () => {
    expect(size(uniq(map(PLANKS, 'saturation')))).toBeGreaterThan(
      FEWEST_DISTINCT_SATURATIONS,
    );
  });
});
