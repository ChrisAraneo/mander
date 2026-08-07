import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findKeyTile } from './find-key-tile';
import { TILE_KEY } from './key';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findKeyTile', () => {
  it('should point at the key when the level holds one', () => {
    expect(
      findKeyTile(
        level([
          [TILE_AIR, TILE_KEY],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should come back empty-handed when the level holds no key', () => {
    expect(
      findKeyTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should take the first it meets when the level scatters more than one', () => {
    expect(
      findKeyTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_KEY, TILE_KEY],
        ]),
      ),
    ).toEqual({ x: 0, y: 1 });
  });
});
