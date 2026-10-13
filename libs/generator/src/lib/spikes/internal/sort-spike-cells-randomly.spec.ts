import { TILE_SPIKE, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortSpikeCellsRandomly } from './sort-spike-cells-randomly';

const WIDTH = 12;

const LEVEL: Tile[][] = [times(WIDTH, () => TILE_SPIKE)];

const CELLS = map(range(WIDTH), (column) => ({ row: 0, column }));

const sortRandomlyWith = (seed: string) =>
  sortSpikeCellsRandomly({
    tiles: LEVEL,
    rate: 1,
    cells: CELLS,
    random: createRandom(seed),
  }).cells;

describe('sortSpikeCellsRandomly', () => {
  it('should keep every spot when it shuffles them', () => {
    expect(sortBy(sortRandomlyWith('DAY-1'), 'column')).toEqual(CELLS);
  });

  it('should mix the spots up when it shuffles them', () => {
    expect(sortRandomlyWith('DAY-1')).not.toEqual(CELLS);
  });

  it('should shuffle the spots the same way when the generator starts from the same seed', () => {
    expect(sortRandomlyWith('DAY-2')).toEqual(sortRandomlyWith('DAY-2'));
  });

  it('should shuffle the spots another way when the generator starts from another seed', () => {
    expect(sortRandomlyWith('DAY-1')).not.toEqual(sortRandomlyWith('DAY-2'));
  });

  it('should give no spots when it gets no spots', () => {
    expect(
      sortSpikeCellsRandomly({
        tiles: LEVEL,
        rate: 1,
        cells: [],
        random: createRandom('DAY-1'),
      }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it shuffles the spots', () => {
    expect(
      sortSpikeCellsRandomly({
        tiles: LEVEL,
        rate: 1,
        cells: [],
        random: createRandom('DAY-1'),
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the rate on when it shuffles the spots', () => {
    expect(
      sortSpikeCellsRandomly({
        tiles: LEVEL,
        rate: 0.6,
        cells: [],
        random: createRandom('DAY-1'),
      }).rate,
    ).toBe(0.6);
  });
});
