import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../get-level-type';
import { findChestCandidates } from './find-chest-candidates';

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const findCandidates = (rows: string[], levelType: LevelType) =>
  findChestCandidates({ tiles: createGrid(rows), levelType }).candidates;

const TWO_FLOORS = ['...', '###', '...', '###'];

describe('findChestCandidates', () => {
  it('should give the top block of each column in a horizontal level when there is room above it', () => {
    expect(findCandidates(['..', '##'], 'HORIZONTAL')).toEqual([
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ]);
  });

  it('should stand on the ledge and not the floor under it in a horizontal level when a column has both', () => {
    expect(findCandidates(['...', '.#.', '...', '###'], 'HORIZONTAL')).toEqual([
      { row: 1, column: 1 },
      { row: 3, column: 0 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when its top block is in the top row', () => {
    expect(findCandidates(['#..', '...', '###'], 'HORIZONTAL')).toEqual([
      { row: 2, column: 1 },
      { row: 2, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when something is in the way above its top block', () => {
    expect(findCandidates(['..', 'o.', '##'], 'HORIZONTAL')).toEqual([
      { row: 2, column: 1 },
    ]);
  });

  it('should give the candidates on every floor of a vertical level when it has more than one', () => {
    expect(findCandidates(TWO_FLOORS, 'VERTICAL')).toEqual([
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 },
      { row: 3, column: 0 },
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a spot in a vertical level when something is in the way above it', () => {
    expect(findCandidates(['.o.', '###'], 'VERTICAL')).toEqual([
      { row: 1, column: 0 },
      { row: 1, column: 2 },
    ]);
  });

  it('should skip a spot in a vertical level when a block sits right on top of it', () => {
    expect(findCandidates(['#.', '##'], 'VERTICAL')).toEqual([
      { row: 1, column: 1 },
    ]);
  });

  it('should give no candidates in a horizontal level when there is nothing to stand on', () => {
    expect(findCandidates(['..', '..'], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when there is nowhere to stand', () => {
    expect(findCandidates(['...', '...'], 'VERTICAL')).toEqual([]);
  });

  it('should give no candidates in a horizontal level when the grid is empty', () => {
    expect(findCandidates([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when the grid is empty', () => {
    expect(findCandidates([], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    const tiles = createGrid(['..', '##']);

    expect(findChestCandidates({ tiles, levelType: 'HORIZONTAL' }).tiles).toBe(
      tiles,
    );
  });

  it('should pass the level type on when it looks for candidates', () => {
    expect(
      findChestCandidates({ tiles: [], levelType: 'VERTICAL' }).levelType,
    ).toBe('VERTICAL');
  });
});
