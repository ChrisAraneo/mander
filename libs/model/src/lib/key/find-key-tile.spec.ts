import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findKeyTile } from './find-key-tile';
import { TILE_KEY } from './tile-key';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findKeyTile', () => {
  it('should return the key position when the level has a key', () => {
    expect(
      findKeyTile(
        createLevel([
          [TILE_AIR, TILE_KEY],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should return null when the level has no key', () => {
    expect(
      findKeyTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should return the first key in reading order when the level has several', () => {
    expect(
      findKeyTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_KEY, TILE_KEY],
        ]),
      ),
    ).toEqual({ x: 0, y: 1 });
  });
});
