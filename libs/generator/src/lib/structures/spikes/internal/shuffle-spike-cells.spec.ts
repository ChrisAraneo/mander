import { TILE_SPIKE, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { shuffleSpikeCells } from './shuffle-spike-cells';

const WIDTH = 12;

const LEVEL: Tile[][] = [times(WIDTH, () => TILE_SPIKE)];

const CELLS = map(range(WIDTH), (column) => ({ row: 0, column }));

const shuffleWith = (seed: string) =>
  shuffleSpikeCells({
    tiles: LEVEL,
    random: createRandom(seed),
    rate: 1,
    cells: CELLS,
  }).cells;

describe('shuffleSpikeCells', () => {
  it('should keep every spot when it shuffles them', () => {
    expect(sortBy(shuffleWith('DAY-1'), 'column')).toEqual(CELLS);
  });

  it('should mix the spots up when it shuffles them', () => {
    expect(shuffleWith('DAY-1')).not.toEqual(CELLS);
  });

  it('should shuffle the spots the same way when the generator starts from the same seed', () => {
    expect(shuffleWith('DAY-2')).toEqual(shuffleWith('DAY-2'));
  });

  it('should shuffle the spots another way when the generator starts from another seed', () => {
    expect(shuffleWith('DAY-1')).not.toEqual(shuffleWith('DAY-2'));
  });

  it('should give no spots when it gets no spots', () => {
    expect(
      shuffleSpikeCells({
        tiles: LEVEL,
        random: createRandom('DAY-1'),
        rate: 1,
        cells: [],
      }).cells,
    ).toEqual([]);
  });

  it('should keep the grid the same when it shuffles the spots', () => {
    expect(
      shuffleSpikeCells({
        tiles: LEVEL,
        random: createRandom('DAY-1'),
        rate: 1,
        cells: [],
      }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the rate on when it shuffles the spots', () => {
    expect(
      shuffleSpikeCells({
        tiles: LEVEL,
        random: createRandom('DAY-1'),
        rate: 0.6,
        cells: [],
      }).rate,
    ).toBe(0.6);
  });
});
