import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import type { Level } from '../types/level';
import type { Tile } from '../types/tile';
import { findPortalBottomTile } from './find-portal-bottom-tile';
import { TILE_PORTAL } from './tile-portal';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(tiles[0]),
  height: size(tiles),
  tiles,
  chestItems: [],
});

describe('findPortalBottomTile', () => {
  it('should return the lowest portal tile when more portal lies below', () => {
    expect(
      findPortalBottomTile(
        createLevel([
          [TILE_AIR, TILE_PORTAL],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 1, y: 0 },
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should return the same tile when the tile below is not portal', () => {
    expect(
      findPortalBottomTile(
        createLevel([
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 1, y: 0 },
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should return the bottom tile when the portal is several tiles tall', () => {
    expect(
      findPortalBottomTile(
        createLevel([
          [TILE_PORTAL],
          [TILE_PORTAL],
          [TILE_PORTAL],
          [TILE_PORTAL],
          [TILE_DIRT],
        ]),
        { x: 0, y: 0 },
      ),
    ).toEqual({ x: 0, y: 3 });
  });

  it('should stop at the bottom row when the portal reaches the bottom of the level', () => {
    expect(
      findPortalBottomTile(createLevel([[TILE_PORTAL], [TILE_PORTAL]]), {
        x: 0,
        y: 0,
      }),
    ).toEqual({ x: 0, y: 1 });
  });

  it('should stay in its column when the portal below is in the next column', () => {
    expect(
      findPortalBottomTile(
        createLevel([
          [TILE_PORTAL, TILE_AIR],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 0, y: 0 },
      ),
    ).toEqual({ x: 0, y: 0 });
  });

  it('should return the same tile when the tile is not a portal', () => {
    expect(
      findPortalBottomTile(createLevel([[TILE_AIR], [TILE_DIRT]]), {
        x: 0,
        y: 0,
      }),
    ).toEqual({ x: 0, y: 0 });
  });
});
