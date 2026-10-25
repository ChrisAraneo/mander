import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isClear } from './is-clear';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

describe('isClear', () => {
  it('should find the spot clear when every tile above it up to the clearance is empty', () => {
    expect(isClear(createGrid(['.', '.', '#']), 2, 0, 2)).toBe(true);
  });

  it('should not find the spot clear when something is in the way above it', () => {
    expect(isClear(createGrid(['o', '.', '#']), 2, 0, 2)).toBe(false);
  });

  it('should not find the spot clear when it sits too near the top of the grid', () => {
    expect(isClear(createGrid(['.', '#']), 1, 0, 2)).toBe(false);
  });

  it('should only look at the tiles within the clearance when something stands higher up', () => {
    expect(isClear(createGrid(['o', '.', '#']), 2, 0, 1)).toBe(true);
  });

  it('should find the spot clear when no clearance is asked for', () => {
    expect(isClear([], 0, 0, 0)).toBe(true);
  });
});
