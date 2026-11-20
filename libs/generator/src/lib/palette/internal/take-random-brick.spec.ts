import { createRandom } from '@mander/common';
import type { Season } from '@mander/model';
import { every, map, size, some, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { takeRandomBrick } from './take-random-brick';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const CLAY_HUE_LOW = 48;

const CLAY_HUE_HIGH = 326;

const SEEDS_TRIED = 200;

const FEWEST_DISTINCT_HUES = 8;

const SPRING_SATURATION_MIN = 18;

const SPRING_SATURATION_MAX = 58;

const SPRING_LIGHTNESS_MIN = 42;

const SUMMER_SATURATION_MIN = 56;

const SUMMER_SATURATION_MAX = 74;

const SUMMER_LIGHTNESS_MIN = 56;

const AUTUMN_SATURATION_MIN = 0;

const AUTUMN_SATURATION_MAX = 60;

const AUTUMN_LIGHTNESS_MAX = 44;

const GREYED_SATURATION_MAX = 6;

const WINTER_SATURATION_MIN = 12;

const WINTER_SATURATION_MAX = 26;

const WINTER_LIGHTNESS_MIN = 58;

const EARTH_LIGHTNESS_MIN = 30;

const createBricks = (season: Season): PaletteMaterialTone[] =>
  times(SEEDS_TRIED, (day) =>
    takeRandomBrick(season, createRandom(`WORLD-${day}`)),
  );

const SPRING_BRICKS = createBricks(SPRING);

const SUMMER_BRICKS = createBricks(SUMMER);

const AUTUMN_BRICKS = createBricks(AUTUMN);

const WINTER_BRICKS = createBricks(WINTER);

const BRICKS = [
  ...SPRING_BRICKS,
  ...SUMMER_BRICKS,
  ...AUTUMN_BRICKS,
  ...WINTER_BRICKS,
];

const isClay = ({ hue }: PaletteMaterialTone): boolean =>
  hue <= CLAY_HUE_LOW || hue >= CLAY_HUE_HIGH;

describe('takeRandomBrick', () => {
  it('should pick the same brick when the generator starts from the same seed', () => {
    expect(takeRandomBrick(SPRING, createRandom('WORLD-1'))).toEqual(
      takeRandomBrick(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other bricks when the seeds differ', () => {
    expect(size(uniq(map(SPRING_BRICKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(SUMMER_BRICKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(AUTUMN_BRICKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
    expect(size(uniq(map(WINTER_BRICKS, 'hue')))).toBeGreaterThan(
      FEWEST_DISTINCT_HUES,
    );
  });

  it('should pick another brick when the season turns', () => {
    expect(takeRandomBrick(SPRING, createRandom('WORLD-1'))).not.toEqual(
      takeRandomBrick(SUMMER, createRandom('WORLD-1')),
    );
    expect(takeRandomBrick(SUMMER, createRandom('WORLD-1'))).not.toEqual(
      takeRandomBrick(AUTUMN, createRandom('WORLD-1')),
    );
    expect(takeRandomBrick(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      takeRandomBrick(WINTER, createRandom('WORLD-1')),
    );
  });

  it('should fire every brick in clay when it picks many bricks', () => {
    expect(every(BRICKS, isClay)).toBe(true);
  });

  it('should leave the green, the blue and the violet out when it picks the bricks', () => {
    expect(
      every(BRICKS, ({ hue }) => !(hue > CLAY_HUE_LOW && hue < CLAY_HUE_HIGH)),
    ).toBe(true);
  });

  it('should keep the bricks bright and light when the season is spring', () => {
    expect(
      every(
        SPRING_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= SPRING_SATURATION_MIN &&
          saturation <= SPRING_SATURATION_MAX &&
          lightness >= SPRING_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should fire the bricks hot and bright when the season is summer', () => {
    expect(
      every(
        SUMMER_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= SUMMER_SATURATION_MIN &&
          saturation <= SUMMER_SATURATION_MAX &&
          lightness >= SUMMER_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should fire the bricks deeper and darker when the season is autumn', () => {
    expect(
      every(
        AUTUMN_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= AUTUMN_SATURATION_MIN &&
          saturation <= AUTUMN_SATURATION_MAX &&
          lightness <= AUTUMN_LIGHTNESS_MAX,
      ),
    ).toBe(true);
  });

  it('should burn some bricks to grey ash when the season is autumn', () => {
    expect(
      some(
        AUTUMN_BRICKS,
        ({ saturation }) => saturation <= GREYED_SATURATION_MAX,
      ),
    ).toBe(true);
  });

  it('should dust the bricks pale and cold when the season is winter', () => {
    expect(
      every(
        WINTER_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= WINTER_SATURATION_MIN &&
          saturation <= WINTER_SATURATION_MAX &&
          lightness >= WINTER_LIGHTNESS_MIN,
      ),
    ).toBe(true);
  });

  it('should keep every brick lighter than the earth around it when it picks the bricks', () => {
    expect(
      every(BRICKS, ({ lightness }) => lightness >= EARTH_LIGHTNESS_MIN),
    ).toBe(true);
  });
});
