import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { parseHsl } from '@mander/render';
import { every, map, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createPalette } from './create-palette';

const HSL_PATTERN = /^HSL\(\d+, \d+%, \d+%\)$/;

const SPRING: Season = 'SPRING';

const AUTUMN: Season = 'AUTUMN';

const SEEDS = times(50, (day) => `WORLD-${day}`);

const createWith = (seed: string) => createPalette(SPRING, createRandom(seed));

const readGroundHues = (season: Season, seed: string): number[] =>
  pipe(createPalette(season, createRandom(seed)), (palette) =>
    map(
      [palette.block, palette.blockCap, palette.blockCapHighlight],
      (colour) => parseHsl(colour)?.hue ?? 0,
    ),
  );

describe('createPalette', () => {
  it('should paint the world the same way when the generator starts from the same seed', () => {
    expect(createWith('WORLD-1')).toEqual(createWith('WORLD-1'));
  });

  it('should paint the worlds in other colours when the generators start from other seeds', () => {
    expect(
      size(uniq(map(SEEDS, (seed) => createWith(seed).blockCap))),
    ).toBeGreaterThan(1);
  });

  it('should give the sky three stops and the hills two shades when it paints a world', () => {
    const palette = createWith('WORLD-1');

    expect(size(palette.sky)).toBe(3);
    expect(size(palette.hills)).toBe(2);
  });

  it('should write every colour as an HSL string when it paints a world', () => {
    const palette = createWith('WORLD-1');

    expect(
      every(
        [
          ...palette.sky,
          ...palette.hills,
          palette.block,
          palette.blockCap,
          palette.blockCapHighlight,
        ],
        (colour) => HSL_PATTERN.test(colour),
      ),
    ).toBe(true);
  });

  it('should light the highlight of the cap above the cap when it paints a world', () => {
    expect(
      every(SEEDS, (seed) =>
        pipe(
          seed,
          createWith,
          (palette) =>
            (parseHsl(palette.blockCapHighlight)?.lightness ?? 0) >
            (parseHsl(palette.blockCap)?.lightness ?? 0),
        ),
      ),
    ).toBe(true);
  });

  it('should grow the ground and its cap in green, lime and yellow when the season is spring', () => {
    expect(
      every(SEEDS, (seed) =>
        every(readGroundHues(SPRING, seed), (hue) => hue >= 50 && hue <= 152),
      ),
    ).toBe(true);
  });

  it('should turn the ground and its cap red, orange and gold when the season is autumn', () => {
    expect(
      every(SEEDS, (seed) =>
        every(readGroundHues(AUTUMN, seed), (hue) => hue <= 68 || hue >= 336),
      ),
    ).toBe(true);
  });

  it('should leave the green out of the ground when the season is autumn', () => {
    expect(
      every(SEEDS, (seed) =>
        every(readGroundHues(AUTUMN, seed), (hue) => !(hue > 68 && hue < 336)),
      ),
    ).toBe(true);
  });

  it('should paint another world when the season turns', () => {
    expect(createPalette(SPRING, createRandom('DAY-1'))).not.toEqual(
      createPalette(AUTUMN, createRandom('DAY-1')),
    );
  });

  it('should paint the recorded spring colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(SPRING, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(112, 30%, 36%)',
      blockCap: 'HSL(132, 38%, 47%)',
      blockCapHighlight: 'HSL(132, 42%, 53%)',
    });
  });

  it('should paint the recorded autumn colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(AUTUMN, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(32, 30%, 36%)',
      blockCap: 'HSL(348, 38%, 47%)',
      blockCapHighlight: 'HSL(348, 42%, 53%)',
    });
  });
});
