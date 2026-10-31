import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { every, map, size, some, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandomBrick } from './create-random-brick';
import type { PaletteMaterialTone } from './types/palette-material-tone';

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const CLAY_HUE_LOW = 48;

const CLAY_HUE_HIGH = 326;

const createBricks = (season: Season): PaletteMaterialTone[] =>
  times(200, (day) => createRandomBrick(season, createRandom(`WORLD-${day}`)));

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

describe('createRandomBrick', () => {
  it('should pick the same brick when the generator starts from the same seed', () => {
    expect(createRandomBrick(SPRING, createRandom('WORLD-1'))).toEqual(
      createRandomBrick(SPRING, createRandom('WORLD-1')),
    );
  });

  it('should pick other bricks when the seeds differ', () => {
    expect(size(uniq(map(SPRING_BRICKS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(SUMMER_BRICKS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(AUTUMN_BRICKS, 'hue')))).toBeGreaterThan(8);
    expect(size(uniq(map(WINTER_BRICKS, 'hue')))).toBeGreaterThan(8);
  });

  it('should pick another brick when the season turns', () => {
    expect(createRandomBrick(SPRING, createRandom('WORLD-1'))).not.toEqual(
      createRandomBrick(SUMMER, createRandom('WORLD-1')),
    );
    expect(createRandomBrick(SUMMER, createRandom('WORLD-1'))).not.toEqual(
      createRandomBrick(AUTUMN, createRandom('WORLD-1')),
    );
    expect(createRandomBrick(AUTUMN, createRandom('WORLD-1'))).not.toEqual(
      createRandomBrick(WINTER, createRandom('WORLD-1')),
    );
  });

  it('should fire every brick in clay when it picks many bricks', () => {
    expect(every(BRICKS, isClay)).toBe(true);
  });

  it('should leave the green, the blue and the violet out of the bricks', () => {
    expect(
      every(BRICKS, ({ hue }) => !(hue > CLAY_HUE_LOW && hue < CLAY_HUE_HIGH)),
    ).toBe(true);
  });

  it('should keep the bricks bright and light when the season is spring', () => {
    expect(
      every(
        SPRING_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= 18 && saturation <= 58 && lightness >= 42,
      ),
    ).toBe(true);
  });

  it('should fire the bricks hot and bright when the season is summer', () => {
    expect(
      every(
        SUMMER_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= 56 && saturation <= 74 && lightness >= 56,
      ),
    ).toBe(true);
  });

  it('should fire the bricks deeper and darker when the season is autumn', () => {
    expect(
      every(
        AUTUMN_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= 0 && saturation <= 60 && lightness <= 44,
      ),
    ).toBe(true);
  });

  it('should burn some bricks to grey ash when the season is autumn', () => {
    expect(some(AUTUMN_BRICKS, ({ saturation }) => saturation <= 6)).toBe(true);
  });

  it('should dust the bricks pale and cold when the season is winter', () => {
    expect(
      every(
        WINTER_BRICKS,
        ({ saturation, lightness }) =>
          saturation >= 12 && saturation <= 26 && lightness >= 58,
      ),
    ).toBe(true);
  });

  it('should keep every brick lighter than the earth around it', () => {
    expect(every(BRICKS, ({ lightness }) => lightness >= 30)).toBe(true);
  });
});
