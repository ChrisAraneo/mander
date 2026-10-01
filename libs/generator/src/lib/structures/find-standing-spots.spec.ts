import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findStandingSpots } from './find-standing-spots';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('findStandingSpots', () => {
  it('should give every block with room above it when the floor is free', () => {
    expect(findStandingSpots(createGrid(['..', '##']), 1)).toEqual([
      { row: 1, column: 0 },
      { row: 1, column: 1 },
    ]);
  });

  it('should give the spots on every floor when the grid has more than one', () => {
    expect(findStandingSpots(createGrid(['.', '#', '.', '#']), 1)).toEqual([
      { row: 1, column: 0 },
      { row: 3, column: 0 },
    ]);
  });

  it('should skip a block when something is in the way above it', () => {
    expect(findStandingSpots(createGrid(['o.', '##']), 1)).toEqual([
      { row: 1, column: 1 },
    ]);
  });

  it('should skip a block when the room above it is lower than asked for', () => {
    expect(findStandingSpots(createGrid(['..', '#.', '..', '##']), 2)).toEqual([
      { row: 3, column: 1 },
    ]);
  });

  it('should skip a block when it sits too near the top of the grid', () => {
    expect(findStandingSpots(createGrid(['.', '#']), 2)).toEqual([]);
  });

  it('should give no spots when nothing in the grid is solid', () => {
    expect(findStandingSpots(createGrid(['..', 'oo']), 1)).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(findStandingSpots([], 1)).toEqual([]);
  });
});
