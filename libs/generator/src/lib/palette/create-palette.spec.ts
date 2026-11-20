import { createRandom } from '@mander/common';
import type { Season } from '@mander/model';
import { type Palette, parseHsl } from '@mander/render';
import { every, map, size, times, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createPalette } from './create-palette';

const HSL_PATTERN = /^HSL\(\d+, \d+%, \d+%\)$/;

const SPRING: Season = 'SPRING';

const SUMMER: Season = 'SUMMER';

const AUTUMN: Season = 'AUTUMN';

const WINTER: Season = 'WINTER';

const SEEDS = times(50, (day) => `WORLD-${day}`);

const createWith = (seed: string): Palette =>
  createPalette(SPRING, createRandom(seed));

const parseGroundHues = (season: Season, seed: string): number[] =>
  pipe(createPalette(season, createRandom(seed)), (palette) =>
    map(
      [palette.block, palette.blockCap, palette.blockCapHighlight],
      (colour) => parseHsl(colour)?.hue ?? 0,
    ),
  );

const getMaterials = (season: Season, seed: string): string[] =>
  pipe(createPalette(season, createRandom(seed)), ({ materials }) => [
    materials?.brick ?? '',
    materials?.wood ?? '',
    materials?.ceramic ?? '',
  ]);

const parseMaterialHue = (
  season: Season,
  seed: string,
  index: number,
): number => parseHsl(getMaterials(season, seed)[index])?.hue ?? 0;

const BRICK = 0;

const WOOD = 1;

const CERAMIC = 2;

const SPRING_HUE_LOW = 50;

const SPRING_HUE_HIGH = 152;

const SUMMER_WARM_HUE_HIGH = 70;

const SUMMER_WARM_HUE_LOW = 316;

const AUTUMN_WARM_HUE_HIGH = 68;

const AUTUMN_WARM_HUE_LOW = 336;

const WINTER_HUE_LOW = 186;

const WINTER_HUE_HIGH = 292;

const CLAY_HUE_HIGH = 48;

const CLAY_HUE_LOW = 326;

const TIMBER_HUE_LOW = 6;

const TIMBER_HUE_HIGH = 52;

const GLAZE_HUE_LOW = 128;

const GLAZE_HUE_HIGH = 330;

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
          ...getMaterials(SPRING, 'WORLD-1'),
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
        every(
          parseGroundHues(SPRING, seed),
          (hue) => hue >= SPRING_HUE_LOW && hue <= SPRING_HUE_HIGH,
        ),
      ),
    ).toBe(true);
  });

  it('should turn the ground and its cap red, orange and gold when the season is autumn', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(AUTUMN, seed),
          (hue) => hue <= AUTUMN_WARM_HUE_HIGH || hue >= AUTUMN_WARM_HUE_LOW,
        ),
      ),
    ).toBe(true);
  });

  it('should leave the green out of the ground when the season is autumn', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(AUTUMN, seed),
          (hue) => !(hue > AUTUMN_WARM_HUE_HIGH && hue < AUTUMN_WARM_HUE_LOW),
        ),
      ),
    ).toBe(true);
  });

  it('should build the bricks out of clay when it paints a world', () => {
    expect(
      every(SEEDS, (seed) =>
        every([SPRING, SUMMER, AUTUMN, WINTER], (season) =>
          pipe(
            parseMaterialHue(season, seed, BRICK),
            (hue) => hue <= CLAY_HUE_HIGH || hue >= CLAY_HUE_LOW,
          ),
        ),
      ),
    ).toBe(true);
  });

  it('should cut the wood out of timber when it paints a world', () => {
    expect(
      every(SEEDS, (seed) =>
        every([SPRING, SUMMER, AUTUMN, WINTER], (season) =>
          pipe(
            parseMaterialHue(season, seed, WOOD),
            (hue) => hue >= TIMBER_HUE_LOW && hue <= TIMBER_HUE_HIGH,
          ),
        ),
      ),
    ).toBe(true);
  });

  it('should glaze the ceramics away from the clay and the timber when it paints a world', () => {
    expect(
      every(SEEDS, (seed) =>
        every([SPRING, SUMMER, AUTUMN, WINTER], (season) =>
          pipe(
            parseMaterialHue(season, seed, CERAMIC),
            (hue) => hue >= GLAZE_HUE_LOW && hue <= GLAZE_HUE_HIGH,
          ),
        ),
      ),
    ).toBe(true);
  });

  it('should give the worlds more than one brick, wood and ceramic when it paints many of them', () => {
    expect(
      size(uniq(map(SEEDS, (seed) => getMaterials(SPRING, seed)[BRICK]))),
    ).toBeGreaterThan(1);
    expect(
      size(uniq(map(SEEDS, (seed) => getMaterials(SPRING, seed)[WOOD]))),
    ).toBeGreaterThan(1);
    expect(
      size(uniq(map(SEEDS, (seed) => getMaterials(SPRING, seed)[CERAMIC]))),
    ).toBeGreaterThan(1);
  });

  it('should fire the bricks, the wood and the ceramics anew when the season turns', () => {
    expect(
      every(
        SEEDS,
        (seed) =>
          !every(
            getMaterials(SPRING, seed),
            (colour, index) => colour === getMaterials(AUTUMN, seed)[index],
          ),
      ),
    ).toBe(true);
  });

  it('should paint another world when the season turns', () => {
    expect(createPalette(SPRING, createRandom('DAY-1'))).not.toEqual(
      createPalette(AUTUMN, createRandom('DAY-1')),
    );
    expect(createPalette(AUTUMN, createRandom('DAY-1'))).not.toEqual(
      createPalette(WINTER, createRandom('DAY-1')),
    );
    expect(createPalette(SUMMER, createRandom('DAY-1'))).not.toEqual(
      createPalette(SPRING, createRandom('DAY-1')),
    );
  });

  it('should paint the recorded spring colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(SPRING, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(112, 30%, 36%)',
      blockCap: 'HSL(132, 38%, 47%)',
      blockCapHighlight: 'HSL(132, 42%, 53%)',
      materials: {
        brick: 'HSL(4, 52%, 50%)',
        wood: 'HSL(26, 30%, 48%)',
        ceramic: 'HSL(148, 40%, 48%)',
      },
    });
  });

  it('should paint the recorded autumn colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(AUTUMN, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(32, 29%, 34%)',
      blockCap: 'HSL(348, 14%, 43%)',
      blockCapHighlight: 'HSL(348, 18%, 49%)',
      materials: {
        brick: 'HSL(2, 56%, 42%)',
        wood: 'HSL(14, 36%, 36%)',
        ceramic: 'HSL(150, 34%, 36%)',
      },
    });
  });

  it('should freeze the ground and its cap in cyan, blue and violet when the season is winter', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(WINTER, seed),
          (hue) => hue >= WINTER_HUE_LOW && hue <= WINTER_HUE_HIGH,
        ),
      ),
    ).toBe(true);
  });

  it('should leave the green, the gold and the red out of the ground when the season is winter', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(WINTER, seed),
          (hue) => !(hue <= SPRING_HUE_HIGH || hue >= AUTUMN_WARM_HUE_LOW),
        ),
      ),
    ).toBe(true);
  });

  it('should paint the recorded winter colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(WINTER, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(248, 24%, 38%)',
      blockCap: 'HSL(264, 15%, 77%)',
      blockCapHighlight: 'HSL(264, 19%, 83%)',
      materials: {
        brick: 'HSL(2, 20%, 64%)',
        wood: 'HSL(18, 14%, 60%)',
        ceramic: 'HSL(174, 44%, 62%)',
      },
    });
  });

  it('should bake the ground and its cap in yellow, gold, orange and pink when the season is summer', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(SUMMER, seed),
          (hue) => hue <= SUMMER_WARM_HUE_HIGH || hue >= SUMMER_WARM_HUE_LOW,
        ),
      ),
    ).toBe(true);
  });

  it('should leave the green, the blue and the violet out of the ground when the season is summer', () => {
    expect(
      every(SEEDS, (seed) =>
        every(
          parseGroundHues(SUMMER, seed),
          (hue) => !(hue > SUMMER_WARM_HUE_HIGH && hue < SUMMER_WARM_HUE_LOW),
        ),
      ),
    ).toBe(true);
  });

  it('should paint the recorded summer colours when the generator starts from the seed DAY-1', () => {
    expect(createPalette(SUMMER, createRandom('DAY-1'))).toEqual({
      sky: ['HSL(216, 26%, 31%)', 'HSL(4, 21%, 47%)', 'HSL(4, 50%, 61%)'],
      hills: ['HSL(216, 20%, 41%)', 'HSL(216, 20%, 35%)'],
      block: 'HSL(328, 56%, 47%)',
      blockCap: 'HSL(332, 60%, 59%)',
      blockCapHighlight: 'HSL(332, 64%, 65%)',
      materials: {
        brick: 'HSL(4, 70%, 58%)',
        wood: 'HSL(18, 40%, 60%)',
        ceramic: 'HSL(288, 58%, 62%)',
      },
    });
  });
});
