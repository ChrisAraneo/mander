import { TILE_BEARTRAP, type Tile } from '@mander/model';
import { map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { shuffleBeartrapCells } from './shuffle-beartrap-cells';

const WIDTH = 12;

const LEVEL: Tile[][] = [times(WIDTH, () => TILE_BEARTRAP)];

const CELLS = map(range(WIDTH), (column) => ({ row: 0, column }));

const shuffleOn = (levelNumber: number) =>
  shuffleBeartrapCells({ tiles: LEVEL, levelNumber, rate: 1, cells: CELLS })
    .cells;

describe('shuffleBeartrapCells', () => {
  it('should keep every spot when it shuffles them', () => {
    expect(sortBy(shuffleOn(1), 'column')).toEqual(CELLS);
  });

  it('should mix the spots up when it shuffles them', () => {
    expect(shuffleOn(1)).not.toEqual(CELLS);
  });

  it('should shuffle the spots the same way when it gets the same grid and level', () => {
    expect(shuffleOn(2)).toEqual(shuffleOn(2));
  });

  it('should shuffle the spots another way when the level is different', () => {
    expect(shuffleOn(1)).not.toEqual(shuffleOn(2));
  });

  it('should give no spots when it gets no spots', () => {
    expect(
      shuffleBeartrapCells({ tiles: LEVEL, levelNumber: 1, rate: 1, cells: [] })
        .cells,
    ).toEqual([]);
  });

  it('should keep the grid and rate the same when it shuffles', () => {
    const shuffled = shuffleBeartrapCells({
      tiles: LEVEL,
      levelNumber: 1,
      rate: 0.35,
      cells: [],
    });

    expect(shuffled.tiles).toBe(LEVEL);
    expect(shuffled.rate).toBe(0.35);
  });
});
