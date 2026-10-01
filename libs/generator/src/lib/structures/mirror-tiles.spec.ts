import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_STONE,
} from '@mander/model';
import { filter, flatMap, flatten, map, range, size, sortBy } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { mirrorTiles } from './mirror-tiles';

const createLevel = (): Tile[][] => [
  [TILE_SPIKE_CEILING, TILE_AIR, TILE_AIR, TILE_AIR],
  [TILE_SPAWN, TILE_AIR, TILE_AIR, TILE_PORTAL],
  [TILE_DIRT, TILE_SPIKE, TILE_AIR, TILE_DIRT],
];

const findColumns = (tiles: Tile[][], wanted: Tile): number[] =>
  flatMap(tiles, (cells) =>
    filter(range(size(cells)), (column) => cells[column] === wanted),
  );

const listTiles = (tiles: Tile[][]): Tile[] => sortBy(flatten(tiles));

describe('mirrorTiles', () => {
  it('should turn each row back to front when it mirrors a grid', () => {
    expect(mirrorTiles([[TILE_DIRT, TILE_AIR, TILE_STONE]])).toEqual([
      [TILE_STONE, TILE_AIR, TILE_DIRT],
    ]);
  });

  it('should send the player in from the other end when the level is mirrored', () => {
    const mirrored = mirrorTiles(createLevel());

    expect(findColumns(createLevel(), TILE_SPAWN)).toEqual([0]);
    expect(findColumns(mirrored, TILE_SPAWN)).toEqual([3]);
    expect(findColumns(mirrored, TILE_PORTAL)).toEqual([0]);
  });

  it('should leave every block standing, just somewhere else, when the level is mirrored', () => {
    expect(listTiles(mirrorTiles(createLevel()))).toEqual(
      listTiles(createLevel()),
    );
  });

  it('should keep the floor spikes down and the ceiling spikes up when the level is mirrored', () => {
    const mirrored = mirrorTiles(createLevel());

    expect(mirrored[0][3]).toBe(TILE_SPIKE_CEILING);
    expect(mirrored[2][2]).toBe(TILE_SPIKE);
  });

  it('should keep the level the same shape when it is mirrored', () => {
    const mirrored = mirrorTiles(createLevel());

    expect(size(mirrored)).toBe(size(createLevel()));
    expect(map(mirrored, size)).toEqual(map(createLevel(), size));
  });

  it('should come back to the original when it mirrors the grid twice', () => {
    expect(mirrorTiles(mirrorTiles(createLevel()))).toEqual(createLevel());
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(mirrorTiles([])).toEqual([]);
  });

  it('should not change the old grid when it mirrors one', () => {
    const tiles = createLevel();

    mirrorTiles(tiles);

    expect(tiles).toEqual(createLevel());
  });
});
