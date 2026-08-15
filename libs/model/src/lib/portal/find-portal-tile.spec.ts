import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findPortalTile } from './find-portal-tile';
import { TILE_PORTAL } from './portal';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findPortalTile', () => {
  it('should report the foot of the portal when the portal stands two tiles tall', () => {
    expect(
      findPortalTile(
        level([
          [TILE_AIR, TILE_PORTAL],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should report the tile itself when the portal is only one tile tall', () => {
    expect(
      findPortalTile(
        level([
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should come back empty-handed when the level offers no way out', () => {
    expect(
      findPortalTile(
        level([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should follow the first portal down to its own foot when the level holds more than one', () => {
    expect(
      findPortalTile(
        level([
          [TILE_AIR, TILE_PORTAL],
          [TILE_PORTAL, TILE_PORTAL],
          [TILE_PORTAL, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 1 });
  });
});
