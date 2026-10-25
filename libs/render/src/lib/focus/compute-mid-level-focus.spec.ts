import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { map, size, split } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { computeMidLevelFocus } from './compute-mid-level-focus';

const toTile = (cell: string): Tile =>
  match(cell)
    .with('#', () => TILE_DIRT)
    .otherwise(() => TILE_AIR);

const createFocusLevel = (rows: string[]): Level =>
  pipe(
    rows,
    (lines) => map(lines, (row) => map(split(row, ''), toTile)),
    (tiles) => ({
      seed: 'FOCUS',
      width: size(tiles[0]),
      height: size(tiles),
      tiles,
      chestItems: [],
    }),
  );

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

describe('computeMidLevelFocus', () => {
  it('should look at the horizontal middle when it focuses on a level', () => {
    expect(computeMidLevelFocus(LEVEL).x).toBe((10 * TILE_SIZE) / 2);
  });

  it('should look at the floor when the level is built on one', () => {
    expect(computeMidLevelFocus(LEVEL).y).toBe(FLOOR_ROW * TILE_SIZE);
  });

  it('should not be fooled upwards when platforms float above the floor', () => {
    expect(computeMidLevelFocus(LEVEL).y).toBeGreaterThan(TILE_SIZE);
  });

  it('should settle halfway down when the level has no floor to find', () => {
    const empty = createFocusLevel(['....', '....', '....', '....']);

    expect(computeMidLevelFocus(empty).y).toBe((4 / 2) * TILE_SIZE);
  });
});
