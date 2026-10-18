import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { map, size, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { getMidLevelFocus } from './get-mid-level-focus';

const toTile = (cell: string): Tile =>
  match(cell)
    .with('#', () => TILE_DIRT)
    .otherwise(() => TILE_AIR);

const createFocusLevel = (rows: string[]): Level =>
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

const LEVEL = createFocusLevel([
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

describe('getMidLevelFocus', () => {
  it('should look at the horizontal middle when it focuses on a level', () => {
    expect(getMidLevelFocus(LEVEL).x).toBe((10 * TILE_SIZE) / 2);
  });

  it('should look at the floor when the level is built on one', () => {
    expect(getMidLevelFocus(LEVEL).y).toBe(FLOOR_ROW * TILE_SIZE);
  });

  it('should not be fooled upwards when platforms float above the floor', () => {
    expect(getMidLevelFocus(LEVEL).y).toBeGreaterThan(TILE_SIZE);
  });

  it('should settle halfway down when the level has no floor to find', () => {
    const empty = createFocusLevel(['....', '....', '....', '....']);

    expect(getMidLevelFocus(empty).y).toBe((4 / 2) * TILE_SIZE);
  });
});
