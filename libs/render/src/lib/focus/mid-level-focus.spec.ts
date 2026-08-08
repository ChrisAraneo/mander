import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { chain, map, size, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { midLevelFocus } from './mid-level-focus';

const toTile = (cell: string): Tile =>
  match(cell)
    .with('#', () => TILE_DIRT)
    .otherwise(() => TILE_AIR);

const tileMap = (rows: string[]): Level =>
  chain(rows)
    .thru((lines) => map(lines, (row) => map(split(row, ''), toTile)))
    .thru((tiles) => ({
      seed: 'FOCUS',
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      chestItems: [],
    }))
    .value();

const LEVEL = tileMap([
  '..........',
  '..###.....',
  '..........',
  '.......##.',
  '..........',
  '#####.####',
  '##########',
  '##########',
]);

const FLOOR_ROW = 5;

describe('midLevelFocus', () => {
  it('looks at the horizontal middle of the level', () => {
    expect(midLevelFocus(LEVEL).x).toBe((10 * TILE_SIZE) / 2);
  });

  it('looks at the floor the level is built on', () => {
    expect(midLevelFocus(LEVEL).y).toBe(FLOOR_ROW * TILE_SIZE);
  });

  it('is not fooled upwards by platforms floating above the floor', () => {
    expect(midLevelFocus(LEVEL).y).toBeGreaterThan(TILE_SIZE);
  });

  it('settles halfway down a level that has no floor to find', () => {
    const empty = tileMap(['....', '....', '....', '....']);

    expect(midLevelFocus(empty).y).toBe((4 / 2) * TILE_SIZE);
  });
});
