import { describe, expect, it } from 'vitest';

import { generateLevel, generateLevelSet, levelSeed } from './generate';
import {
  awayFromEntityHue,
  CAP_LIGHTNESS_MAX,
  CAP_LIGHTNESS_MIN,
  ENTITY_HUE,
  ENTITY_HUE_GUARD,
  GROUND_LIGHTNESS_MAX,
  GROUND_LIGHTNESS_MIN,
  hslCss,
  type Palette,
  rollPalette,
  wrapHue,
} from './palette';
import { createRng } from './rng';

const HSL_PATTERN =
  /^HSL\((?<hue>\d+), (?<saturation>\d+)%, (?<lightness>\d+)%\)$/u;

const parse = (color: string): { hue: number; lightness: number } => {
  const groups = HSL_PATTERN.exec(color)?.groups;
  if (!groups) throw new Error(`not an HSL color: ${color}`);
  return { hue: Number(groups.hue), lightness: Number(groups.lightness) };
};

const colorsOf = (palette: Palette): string[] => [
  ...palette.sky,
  ...palette.hills,
  palette.block,
  palette.blockCap,
  palette.blockCapHighlight,
];

const SEEDS = ['PALETTE-A', 'PALETTE-B', 'PALETTE-C', 'MANDER', 'DAILY-1'];

describe('hslCss', () => {
  it('rounds to whole degrees and percentages', () => {
    expect(hslCss({ hue: 210.4, saturation: 33.6, lightness: 21 })).toBe(
      'HSL(210, 34%, 21%)',
    );
  });
});

describe('wrapHue', () => {
  it('keeps hues on the colour wheel', () => {
    expect(wrapHue(20)).toBe(20);
    expect(wrapHue(380)).toBe(20);
    expect(wrapHue(-20)).toBe(340);
  });
});

describe('awayFromEntityHue', () => {
  it('leaves hues clear of the player and enemy band alone', () => {
    expect(awayFromEntityHue(200)).toBe(200);
    expect(awayFromEntityHue(ENTITY_HUE + ENTITY_HUE_GUARD)).toBe(
      ENTITY_HUE + ENTITY_HUE_GUARD,
    );
  });

  it('pushes hues out of that band, to the nearer side', () => {
    expect(awayFromEntityHue(ENTITY_HUE)).toBe(ENTITY_HUE + ENTITY_HUE_GUARD);
    expect(awayFromEntityHue(ENTITY_HUE + 5)).toBe(
      ENTITY_HUE + ENTITY_HUE_GUARD,
    );
    expect(awayFromEntityHue(ENTITY_HUE - 5)).toBe(
      wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD),
    );
  });
});

describe('rollPalette', () => {
  it('is deterministic for the same rng seed', () => {
    expect(rollPalette(createRng('PALETTE'))).toEqual(
      rollPalette(createRng('PALETTE')),
    );
  });

  it.each(SEEDS)('emits only valid HSL colors for %s', (seed) => {
    for (const color of colorsOf(rollPalette(createRng(seed)))) {
      expect(color, color).toMatch(HSL_PATTERN);
    }
  });

  it.each(SEEDS)(
    'keeps the ground readable under the bodies for %s',
    (seed) => {
      const palette = rollPalette(createRng(seed));
      const block = parse(palette.block);
      const cap = parse(palette.blockCap);
      const highlight = parse(palette.blockCapHighlight);

      expect(block.lightness).toBeGreaterThanOrEqual(GROUND_LIGHTNESS_MIN);
      expect(block.lightness).toBeLessThanOrEqual(GROUND_LIGHTNESS_MAX);
      expect(cap.lightness).toBeGreaterThanOrEqual(CAP_LIGHTNESS_MIN);
      expect(cap.lightness).toBeLessThanOrEqual(CAP_LIGHTNESS_MAX + 1);
      expect(cap.lightness, 'the cap reads above the block').toBeGreaterThan(
        block.lightness,
      );
      expect(highlight.lightness).toBeGreaterThan(cap.lightness);
      expect(cap.hue, 'the cap never wears the player colour').toBe(
        awayFromEntityHue(cap.hue),
      );
    },
  );

  it.each(SEEDS)('darkens the sky towards the top for %s', (seed) => {
    const { sky, hills } = rollPalette(createRng(seed));
    const [top, middle, horizon] = sky.map(parse);
    const [far, near] = hills.map(parse);

    expect(middle.lightness).toBeGreaterThan(top.lightness);
    expect(horizon.lightness).toBeGreaterThan(middle.lightness);
    expect(near.lightness, 'the near hills sit darkest').toBeLessThan(
      far.lightness,
    );
    expect(far.lightness, 'hills stay between the sky bands').toBeLessThan(
      horizon.lightness,
    );
  });
});

describe('level palettes', () => {
  it('gives every run its own palette, deterministically', () => {
    const palettes = SEEDS.map((seed) => generateLevelSet(seed)[0].palette);
    expect(
      new Set(palettes.map((palette) => JSON.stringify(palette))).size,
    ).toBe(SEEDS.length);
    expect(generateLevelSet('MANDER')[0].palette).toEqual(
      generateLevelSet('MANDER')[0].palette,
    );
  });

  it('paints all eight levels of a run with one shared palette', () => {
    const levels = generateLevelSet('MANDER');
    const shared = JSON.stringify(levels[0].palette);
    for (const level of levels) {
      expect(JSON.stringify(level.palette)).toBe(shared);
    }
  });

  it('keeps the palette fixed when only the level index changes', () => {
    expect(generateLevel(levelSeed('MANDER', 0), 0, 'MANDER').palette).toEqual(
      generateLevel(levelSeed('MANDER', 1), 1, 'MANDER').palette,
    );
  });
});
