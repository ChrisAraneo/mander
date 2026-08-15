import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';
import { flatMap, map, size, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { mirrorTiles } from './mirror-tiles';

const LEVEL: Tile[][] = [
  [TILE_SPIKE_CEILING, TILE_AIR, TILE_AIR, TILE_AIR],
  [TILE_SPAWN, TILE_AIR, TILE_AIR, TILE_PORTAL],
  [TILE_DIRT, TILE_SPIKE, TILE_AIR, TILE_DIRT],
];

const columnsOf = (tiles: Tile[][], wanted: Tile): number[] =>
  flatMap(tiles, (row) =>
    flatMap(row, (tile, column) => (tile === wanted ? [column] : [])),
  );

const census = (tiles: Tile[][]): Tile[] =>
  sortBy(flatMap(tiles, (row) => row));

describe('mirrorTiles', () => {
  it('should turn each row back to front', () => {
    expect(mirrorTiles([[1, 2, 3] as Tile[]])).toEqual([[3, 2, 1]]);
  });

  it('should send the player in from the other end', () => {
    const mirrored = mirrorTiles(LEVEL);

    expect(columnsOf(LEVEL, TILE_SPAWN)).toEqual([0]);
    expect(columnsOf(mirrored, TILE_SPAWN)).toEqual([3]);
    expect(columnsOf(mirrored, TILE_PORTAL)).toEqual([0]);
  });

  it('should leave every block standing, just somewhere else', () => {
    expect(census(mirrorTiles(LEVEL))).toEqual(census(LEVEL));
  });

  it('should keep the floor spikes down and the ceiling spikes up', () => {
    const mirrored = mirrorTiles(LEVEL);

    expect(mirrored[0][3]).toBe(TILE_SPIKE_CEILING);
    expect(mirrored[2][2]).toBe(TILE_SPIKE);
  });

  it('should keep the level the same shape', () => {
    const mirrored = mirrorTiles(LEVEL);

    expect(size(mirrored)).toBe(size(LEVEL));
    expect(map(mirrored, size)).toEqual(map(LEVEL, size));
  });

  it('should come back to the original when mirrored twice', () => {
    expect(mirrorTiles(mirrorTiles(LEVEL))).toEqual(LEVEL);
  });

  it('should leave the level it was handed untouched', () => {
    const before = census(LEVEL);

    mirrorTiles(LEVEL);

    expect(LEVEL[1][0]).toBe(TILE_SPAWN);
    expect(census(LEVEL)).toEqual(before);
  });
});
