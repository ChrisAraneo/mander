import { createRandom } from '@mander/engine';
import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { filterGemCandidates } from './filter-gem-candidates';

const RANDOM = createRandom('SEED');

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const filterCandidates = (rows: string[], levelType: LevelType) =>
  filterGemCandidates({ tiles: createGrid(rows), levelType, random: RANDOM })
    .candidates;

describe('filterGemCandidates', () => {
  it('should give the top block of each column in a horizontal level when there are three free blocks above it', () => {
    expect(filterCandidates(['..', '..', '..', '##'], 'HORIZONTAL')).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 1 },
    ]);
  });

  it('should stand on the ledge and not the ground under it in a horizontal level when a column has both', () => {
    expect(
      filterCandidates(
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
      filterCandidates(['...', '#..', '...', '...', '###'], 'HORIZONTAL'),
    ).toEqual([
      { row: 4, column: 1 },
      { row: 4, column: 2 },
    ]);
  });

  it('should skip a column in a horizontal level when something is in the way above its top block', () => {
    expect(
      filterCandidates(['...', 'o..', '...', '###'], 'HORIZONTAL'),
    ).toEqual([
      { row: 3, column: 1 },
      { row: 3, column: 2 },
    ]);
  });

  it('should give the candidates on every floor of a vertical level when each has three free blocks above it', () => {
    expect(
      filterCandidates(
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
      filterCandidates(
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
    expect(filterCandidates(['...', '.o.', '...', '###'], 'VERTICAL')).toEqual([
      { row: 3, column: 0 },
      { row: 3, column: 2 },
    ]);
  });

  it('should give no candidates in a horizontal level when there is nothing to stand on', () => {
    expect(filterCandidates(['..', '..'], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when there is nowhere to stand', () => {
    expect(filterCandidates(['...', '...'], 'VERTICAL')).toEqual([]);
  });

  it('should give no candidates in a horizontal level when the grid is empty', () => {
    expect(filterCandidates([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give no candidates in a vertical level when the grid is empty', () => {
    expect(filterCandidates([], 'VERTICAL')).toEqual([]);
  });

  it('should keep the grid the same when it looks for candidates', () => {
    const tiles = createGrid(['..', '##']);

    expect(
      filterGemCandidates({ tiles, levelType: 'HORIZONTAL', random: RANDOM })
        .tiles,
    ).toBe(tiles);
  });

  it('should pass the level type on when it looks for candidates', () => {
    expect(
      filterGemCandidates({ tiles: [], levelType: 'VERTICAL', random: RANDOM })
        .levelType,
    ).toBe('VERTICAL');
  });

  it('should pass the generator on when it looks for candidates', () => {
    expect(
      filterGemCandidates({ tiles: [], levelType: 'VERTICAL', random: RANDOM })
        .random,
    ).toBe(RANDOM);
  });
});
