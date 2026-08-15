import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import { findTile } from './find-tile';
import type { Tile } from './tile';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findTile', () => {
  it('should point at the tile when the level holds the kind it was sent for', () => {
    expect(
      findTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_DIRT],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should point at the very first corner when the tile lies there', () => {
    expect(
      findTile(
        level([
          [TILE_DIRT, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 0, y: 0 });
  });

  it('should take the leftmost of the highest row when the level holds several', () => {
    expect(
      findTile(
        level([
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_AIR, TILE_DIRT],
          [TILE_DIRT, TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toEqual({ x: 0, y: 1 });
  });

  it('should come back empty-handed when the level holds no such tile', () => {
    expect(
      findTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        TILE_DIRT,
      ),
    ).toBeNull();
  });

  it('should come back empty-handed when the only tiles lie past the width and height the level claims', () => {
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
