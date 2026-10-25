import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findTiles } from './find-tiles';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findTiles', () => {
  it('should return every tile position when the level has several of the tile', () => {
    expect(
      findTiles(
        createLevel([
          [TILE_DIRT, TILE_AIR, TILE_DIRT],
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_DIRT, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 2 },
    ]);
  });

  it('should return the positions in reading order when every tile matches', () => {
    expect(
      findTiles(
        createLevel([
          [TILE_DIRT, TILE_DIRT],
          [TILE_DIRT, TILE_DIRT],
        ]),
        TILE_DIRT,
      ),
    ).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('should return nothing when the level does not have the tile', () => {
    expect(
      findTiles(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual([]);
  });

  it('should return only the tiles inside the level when tiles lie outside its width and height', () => {
    expect(
      findTiles(
        {
          seed: 'SEED',
          width: 1,
          height: 1,
          tiles: [
            [TILE_DIRT, TILE_DIRT],
            [TILE_DIRT, TILE_DIRT],
          ],
          chestItems: [],
        },
        TILE_DIRT,
      ),
    ).toEqual([{ x: 0, y: 0 }]);
  });
});
