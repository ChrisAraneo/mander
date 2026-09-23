import { chain } from '@mander/utils';
import {
  SOLID_TILES,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { parseHsl, shiftHsl } from '@mander/utils';
import { assign, forEach, get } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../palette';
import { DIRT_STYLE, STONE_STYLE } from './consts';
import { createMaterialPalette } from './material-palettes';
import { getMaterialStyle } from './material-styles';

const palette = (block: string): Palette => ({
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block,
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
});

const BROWN = palette('HSL(30, 25%, 27%)');

const hueGap = (left: number, right: number): number =>
  Math.abs(((left - right + 540) % 360) - 180);

const { nullish } = P;

const lightnessOf = (color: string): number =>
  match(parseHsl(color))
    .with(nullish, () => Number.NaN)
    .otherwise((hsl) => hsl.lightness);

describe('createMaterialPalette', () => {
  it('should paint the dirt in the colours the level rolled when it builds a palette', () => {
    const dirt = createMaterialPalette(BROWN)(TILE_DIRT);
    expect(dirt.base).toBe(BROWN.block);
    expect(dirt.cap, 'the grass is the palette cap').toBe(BROWN.blockCap);
    expect(dirt.capHighlight).toBe(BROWN.blockCapHighlight);
  });

  it('should step the other materials away from the ground colour when it builds a palette', () => {
    const styles = createMaterialPalette(BROWN);
    expect(styles(TILE_BRICK).base).toBe('HSL(10, 27%, 43%)');
    expect(styles(TILE_STONE).base).toBe('HSL(213, 3%, 46%)');
    expect(styles(TILE_WOOD).base).toBe('HSL(26, 21%, 43%)');
    expect(styles(TILE_CERAMIC).base).toBe('HSL(295, 17%, 51%)');
  });

  it('should give ceramic a hue of its own rather than a paler stone when it builds a palette', () => {
    const styles = createMaterialPalette(BROWN);
    const ceramic = parseHsl(styles(TILE_CERAMIC).base);
    const stone = parseHsl(styles(TILE_STONE).base);
    const dirt = parseHsl(styles(TILE_DIRT).base);

    expect(
      hueGap(get(ceramic, 'hue', 0), get(stone, 'hue', 0)),
    ).toBeGreaterThan(60);
    expect(hueGap(get(ceramic, 'hue', 0), get(dirt, 'hue', 0))).toBeGreaterThan(
      60,
    );
    expect(
      get(ceramic, 'saturation', 0),
      'ceramic keeps its colour where stone loses its own',
    ).toBeGreaterThan(get(stone, 'saturation', 0) + 10);
    expect(get(ceramic, 'lightness', 0)).toBeLessThan(65);
  });

  it('should follow the ground round the colour wheel when the rolled hue runs off the end', () => {
    const rolled = createMaterialPalette(palette('HSL(300, 25%, 27%)'));
    expect(rolled(TILE_DIRT).base).toBe('HSL(300, 25%, 27%)');
    expect(rolled(TILE_STONE).base, 'the hue wraps').toBe('HSL(123, 3%, 46%)');
  });

  it('should cap the material lighter than its own body when it builds a palette', () => {
    const styles = createMaterialPalette(BROWN);
    forEach(SOLID_TILES, (tile) =>
      chain(styles(tile))
        .thru((style) => ({
          base: lightnessOf(style.base),
          cap: lightnessOf(style.cap),
          capHighlight: lightnessOf(style.capHighlight),
        }))
        .thru(({ base, cap, capHighlight }) => {
          expect(cap, `${tile} cap`).toBeGreaterThan(base);
          expect(capHighlight, `${tile} cap highlight`).toBeGreaterThan(cap);
        })
        .value(),
    );
  });

  it('should keep the hand-picked styles when there is no ground colour', () => {
    const styles = createMaterialPalette(palette(''));
    expect(styles(TILE_DIRT)).toEqual(DIRT_STYLE);
    expect(styles(TILE_STONE)).toEqual(STONE_STYLE);
    expect(styles(TILE_STONE)).toEqual(getMaterialStyle(TILE_STONE));
  });
});

describe('hsl maths', () => {
  it('should read the colour back when it is written the way the palette writes it', () => {
    expect(parseHsl('HSL(210, 34%, 21%)')).toEqual({
      hue: 210,
      saturation: 34,
      lightness: 21,
    });
    expect(parseHsl('#6F5A43')).toBeUndefined();
    expect(parseHsl('')).toBeUndefined();
  });

  it('should wrap the hue and stop saturation and lightness at the ends when a shift runs past them', () => {
    const color = { hue: 350, saturation: 90, lightness: 10 };
    expect(shiftHsl(color, { hue: 30 })).toEqual(
      assign({}, color, { hue: 20 }),
    );
    expect(shiftHsl(color, { saturation: 40 }).saturation).toBe(100);
    expect(shiftHsl(color, { lightness: -40 }).lightness).toBe(0);
  });
});
