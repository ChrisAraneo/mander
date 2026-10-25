import { createRandom } from '@mander/engine';
import { parseHsl } from '@mander/render';
import { every, map, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createPalette } from './create-palette';

const HSL_PATTERN = /^HSL\(\d+, \d+%, \d+%\)$/;

const SEEDS = times(50, (day) => `WORLD-${day}`);

describe('createPalette', () => {
  it('should paint the world the same way when the generator starts from the same seed', () => {
    expect(createPalette(createRandom('WORLD-1'))).toEqual(
      createPalette(createRandom('WORLD-1')),
    );
  });

  it('should paint the worlds in other colours when the generators start from other seeds', () => {
    expect(
      size(
        uniq(map(SEEDS, (seed) => createPalette(createRandom(seed)).blockCap)),
      ),
    ).toBeGreaterThan(1);
  });

  it('should give the sky three stops and the hills two shades when it paints a world', () => {
    const palette = createPalette(createRandom('WORLD-1'));

    expect(size(palette.sky)).toBe(3);
    expect(size(palette.hills)).toBe(2);
  });

  it('should write every colour as an HSL string when it paints a world', () => {
    const palette = createPalette(createRandom('WORLD-1'));

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
          createRandom,
          createPalette,
          (palette) =>
            (parseHsl(palette.blockCapHighlight)?.lightness ?? 0) >
            (parseHsl(palette.blockCap)?.lightness ?? 0),
        ),
      ),
    ).toBe(true);
  });

  it('should paint the recorded colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(48, 30%, 36%)',
      blockCap: 'HSL(140, 38%, 47%)',
      blockCapHighlight: 'HSL(140, 42%, 53%)',
    });
  });
});
