import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findPortalTile } from './find-portal-tile';
import { TILE_PORTAL } from './tile-portal';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findPortalTile', () => {
  it('should return the bottom tile when the portal is two tiles tall', () => {
    expect(
      findPortalTile(
        createLevel([
          [TILE_AIR, TILE_PORTAL],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should return the portal tile when the portal is one tile tall', () => {
    expect(
      findPortalTile(
        createLevel([
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should return null when the level has no portal', () => {
    expect(
      findPortalTile(
        createLevel([
          [TILE_AIR, TILE_AIR],
          [TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toBeNull();
  });

  it('should return the bottom of the first portal when the level has several', () => {
    expect(
      findPortalTile(
        createLevel([
          [TILE_AIR, TILE_PORTAL],
          [TILE_PORTAL, TILE_PORTAL],
          [TILE_PORTAL, TILE_DIRT],
        ]),
      ),
    ).toEqual({ x: 1, y: 1 });
  });
});
