import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { findTiles } from './find-tiles';
import type { Tile } from './tile';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findTiles', () => {
  it('should gather every tile when the level scatters the kind it was sent for', () => {
    expect(
      findTiles(
        level([
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

  it('should hand them back in reading order when the level is full of them', () => {
    expect(
      findTiles(
        level([
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

  it('should gather nothing when the level holds none', () => {
    expect(
      findTiles(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual([]);
  });

  it('should gather only what is in bounds when tiles lie past the width and height the level claims', () => {
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
