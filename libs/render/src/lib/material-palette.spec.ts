import {
  type Palette,
  SOLID_TILES,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/engine';
import { parseHsl, shiftHsl } from '@mander/utils';
import { forEach } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { materialPalette } from './material-palette';
import { DIRT_STYLE, materialStyle, STONE_STYLE } from './material-styles';

const palette = (block: string): Palette => ({
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block,
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
});

const BROWN = palette('HSL(30, 25%, 27%)');

/** Shortest way round the wheel between two hues. */
const hueGap = (left: number, right: number): number =>
  Math.abs(((left - right + 540) % 360) - 180);

const lightnessOf = (color: string): number => {
  const hsl = parseHsl(color);
  if (!hsl) throw new Error(`not an HSL color: ${color}`);
  return hsl.lightness;
};

describe('materialPalette', () => {
  it('paints dirt in the colours the level rolled', () => {
    const dirt = materialPalette(BROWN)(TILE_DIRT);
    expect(dirt.base).toBe(BROWN.block);
    expect(dirt.cap, 'the grass is the palette cap').toBe(BROWN.blockCap);
    expect(dirt.capHighlight).toBe(BROWN.blockCapHighlight);
  });

  it('steps the other materials away from that ground colour', () => {
    const styles = materialPalette(BROWN);
    expect(styles(TILE_BRICK).base).toBe('HSL(10, 37%, 43%)');
    expect(styles(TILE_STONE).base).toBe('HSL(213, 3%, 46%)');
    expect(styles(TILE_WOOD).base).toBe('HSL(26, 25%, 45%)');
    expect(styles(TILE_CERAMIC).base).toBe('HSL(295, 47%, 49%)');
  });

  it('gives ceramic a hue of its own rather than a paler stone', () => {
    const styles = materialPalette(BROWN);
    const ceramic = parseHsl(styles(TILE_CERAMIC).base);
    const stone = parseHsl(styles(TILE_STONE).base);
    const dirt = parseHsl(styles(TILE_DIRT).base);

    expect(hueGap(ceramic?.hue ?? 0, stone?.hue ?? 0)).toBeGreaterThan(60);
    expect(hueGap(ceramic?.hue ?? 0, dirt?.hue ?? 0)).toBeGreaterThan(60);
    // Colour, not highlight: it must not simply be the ground turned white.
    expect(ceramic?.saturation ?? 0).toBeGreaterThan(30);
    expect(ceramic?.lightness ?? 0).toBeLessThan(65);
  });

  it('follows the ground round the colour wheel', () => {
    const rolled = materialPalette(palette('HSL(300, 25%, 27%)'));
    expect(rolled(TILE_DIRT).base).toBe('HSL(300, 25%, 27%)');
    expect(rolled(TILE_STONE).base, 'the hue wraps').toBe('HSL(123, 3%, 46%)');
  });

  it('caps every material lighter than its own body', () => {
    const styles = materialPalette(BROWN);
    forEach(SOLID_TILES, (tile) => {
      const style = styles(tile);
      expect(lightnessOf(style.cap), `${tile} cap`).toBeGreaterThan(
        lightnessOf(style.base),
      );
      expect(
        lightnessOf(style.capHighlight),
        `${tile} cap highlight`,
      ).toBeGreaterThan(lightnessOf(style.cap));
    });
  });

  it('keeps the hand-picked styles when there is no ground colour', () => {
    const styles = materialPalette(palette(''));
    expect(styles(TILE_DIRT)).toEqual(DIRT_STYLE);
    expect(styles(TILE_STONE)).toEqual(STONE_STYLE);
    expect(styles(TILE_STONE)).toEqual(materialStyle(TILE_STONE));
  });
});

describe('hsl maths', () => {
  it('reads the colours the palette is written in', () => {
    expect(parseHsl('HSL(210, 34%, 21%)')).toEqual({
      hue: 210,
      saturation: 34,
      lightness: 21,
    });
    expect(parseHsl('#6F5A43')).toBeUndefined();
    expect(parseHsl('')).toBeUndefined();
  });

  it('wraps hues and stops saturation and lightness at the ends', () => {
    const color = { hue: 350, saturation: 90, lightness: 10 };
    expect(shiftHsl(color, { hue: 30 })).toEqual({ ...color, hue: 20 });
    expect(shiftHsl(color, { saturation: 40 }).saturation).toBe(100);
    expect(shiftHsl(color, { lightness: -40 }).lightness).toBe(0);
  });
});
