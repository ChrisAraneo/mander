import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../get-level-type';
import { findGemCandidates } from './find-gem-candidates';

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const findCandidates = (rows: string[], levelType: LevelType) =>
  findGemCandidates({ tiles: createGrid(rows), levelType }).candidates;

describe('findGemCandidates', () => {
  it('should give the top block of each column in a horizontal level when there are three free blocks above it', () => {
    expect(findCandidates(['..', '..', '..', '##'], 'HORIZONTAL')).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 1 },
    ]);
  });

  it('should stand on the ledge and not the ground under it in a horizontal level when a column has both', () => {
    expect(
      findCandidates(
        ['...', '...', '...', '.#.', '...', '...', '...', '###'],
        'HORIZONTAL',
      ),
    ).toEqual([
      { row: 3, column: 1 },
      { row: 7, column: 0 },
      { row: 7, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when its top block has less than three free blocks above it', () => {
    expect(
      findCandidates(['...', '#..', '...', '...', '###'], 'HORIZONTAL'),
    ).toEqual([
      { row: 4, column: 1 },
      { row: 4, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when something is in the way above its top block', () => {
    expect(findCandidates(['...', 'o..', '...', '###'], 'HORIZONTAL')).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should give the candidates on every floor of a vertical level when each has three free blocks above it', () => {
    expect(
      findCandidates(
        ['...', '...', '...', '###', '...', '...', '...', '###'],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 1 },
      { row: 3, column: 2 },
      { row: 7, column: 0 },
      { row: 7, column: 1 },
      { row: 7, column: 2 },
    ]);
  });

  it('should skip a floor of a vertical level when it has less than three free blocks above it', () => {
    expect(
      findCandidates(
        ['...', '...', '...', '###', '...', '...', '###'],
        'VERTICAL',
      ),
    ).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should skip a spot in a vertical level when something is in the way above it', () => {
    expect(findCandidates(['...', '.o.', '...', '###'], 'VERTICAL')).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 2 },
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

    expect(findGemCandidates({ tiles, levelType: 'HORIZONTAL' }).tiles).toBe(
      tiles,
    );
  });

  it('should pass the level type on when it looks for candidates', () => {
    expect(
      findGemCandidates({ tiles: [], levelType: 'VERTICAL' }).levelType,
    ).toBe('VERTICAL');
  });
});
