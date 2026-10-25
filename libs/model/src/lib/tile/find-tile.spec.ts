import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findTile } from './find-tile';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findTile', () => {
  it('should return the tile position when the level has the tile', () => {
    expect(
      findTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_DIRT],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should return the top left corner when the tile is there', () => {
    expect(
      findTile(
        createLevel([
          [TILE_DIRT, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 0, y: 0 });
  });

  it('should return the leftmost tile of the top row when the level has several', () => {
    expect(
      findTile(
        createLevel([
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_AIR, TILE_DIRT],
          [TILE_DIRT, TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 0, y: 1 });
  });

  it('should return null when the level does not have the tile', () => {
    expect(
      findTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toBeNull();
  });

  it('should return null when the only tiles lie outside the level width and height', () => {
    expect(
      findTile(
        {
          seed: 'SEED',
          width: 1,
          height: 1,
          tiles: [
            [TILE_AIR, TILE_DIRT],
            [TILE_DIRT, TILE_DIRT],
          ],
          chestItems: [],
        },
        TILE_DIRT,
      ),
    ).toBeNull();
  });
});
