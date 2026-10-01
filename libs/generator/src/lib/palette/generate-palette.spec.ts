import { parseHsl } from '@mander/utils';
import { every, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generatePalette } from './generate-palette';

const HSL_PATTERN = /^HSL\(\d+, \d+%, \d+%\)$/;

const SEEDS = times(50, (day) => `WORLD-${day}`);

describe('generatePalette', () => {
  it('should paint the world the same way when the seed is the same', () => {
    expect(generatePalette('WORLD-1')).toEqual(generatePalette('WORLD-1'));
  });

  it('should paint the worlds in other colours when the seeds differ', () => {
    expect(
      size(uniq(map(SEEDS, (seed) => generatePalette(seed).blockCap))),
    ).toBeGreaterThan(1);
  });

  it('should give the sky three stops and the hills two shades when it paints a world', () => {
    const palette = generatePalette('WORLD-1');

    expect(size(palette.sky)).toBe(3);
    expect(size(palette.hills)).toBe(2);
  });

  it('should write every colour as an HSL string when it paints a world', () => {
    const palette = generatePalette('WORLD-1');

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
      every(SEEDS, (seed) => {
        const palette = generatePalette(seed);

        return (
          (parseHsl(palette.blockCapHighlight)?.lightness ?? 0) >
          (parseHsl(palette.blockCap)?.lightness ?? 0)
        );
      }),
    ).toBe(true);
  });
});
