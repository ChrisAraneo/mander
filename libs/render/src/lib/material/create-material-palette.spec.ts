import {
  SOLID_TILES,
  TILE_BRICK,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { get, map } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { Palette } from '../types/palette';
import { DIRT_STYLE, STONE_STYLE } from './consts';
import { createMaterialPalette } from './create-material-palette';
import { getMaterialStyle } from './get-material-style';
import { parseHsl } from '../color/parse-hsl';

const { nullish } = P;

const createTestPalette = (block: string): Palette => ({
  sky: ['HSL(210, 30%, 12%)', 'HSL(210, 30%, 22%)', 'HSL(210, 30%, 28%)'],
  hills: ['HSL(210, 26%, 18%)', 'HSL(210, 26%, 14%)'],
  block,
  blockCap: 'HSL(96, 42%, 48%)',
  blockCapHighlight: 'HSL(96, 47%, 54%)',
});

const BROWN = createTestPalette('HSL(30, 25%, 27%)');

const computeHueGap = (left: number, right: number): number =>
  Math.abs(((left - right + 540) % 360) - 180);

const toLightness = (color: string): number =>
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
      computeHueGap(get(ceramic, 'hue', 0), get(stone, 'hue', 0)),
    ).toBeGreaterThan(60);
    expect(
      computeHueGap(get(ceramic, 'hue', 0), get(dirt, 'hue', 0)),
    ).toBeGreaterThan(60);
    expect(
      get(ceramic, 'saturation', 0),
      'ceramic keeps its colour where stone loses its own',
    ).toBeGreaterThan(get(stone, 'saturation', 0) + 10);
    expect(get(ceramic, 'lightness', 0)).toBeLessThan(65);
  });

  it('should follow the ground round the colour wheel when the rolled hue runs off the end', () => {
    const rolled = createMaterialPalette(
      createTestPalette('HSL(300, 25%, 27%)'),
    );

    expect(rolled(TILE_DIRT).base).toBe('HSL(300, 25%, 27%)');
    expect(rolled(TILE_STONE).base, 'the hue wraps').toBe('HSL(123, 3%, 46%)');
  });

  it('should cap the material lighter than its own body when it builds a palette', () => {
    const styles = createMaterialPalette(BROWN);

    map(SOLID_TILES, (tile) =>
      expect(toLightness(styles(tile).cap), `${tile} cap`).toBeGreaterThan(
        toLightness(styles(tile).base),
      ),
    );
    map(SOLID_TILES, (tile) =>
      expect(
        toLightness(styles(tile).capHighlight),
        `${tile} cap highlight`,
      ).toBeGreaterThan(toLightness(styles(tile).cap)),
    );
  });

  it('should keep the hand-picked styles when there is no ground colour', () => {
    const styles = createMaterialPalette(createTestPalette(''));

    expect(styles(TILE_DIRT)).toEqual(DIRT_STYLE);
    expect(styles(TILE_STONE)).toEqual(STONE_STYLE);
    expect(styles(TILE_STONE)).toEqual(getMaterialStyle(TILE_STONE));
  });
});
