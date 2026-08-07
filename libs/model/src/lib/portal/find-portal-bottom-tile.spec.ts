import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_DIRT } from '../blocks/dirt';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';
import { findPortalBottomTile } from './find-portal-bottom-tile';
import { TILE_PORTAL } from './portal';

const level = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: tiles[0].length,
  height: tiles.length,
  tiles,
  chestItems: [],
});

describe('findPortalBottomTile', () => {
  it('should climb down to the tile the portal rests on when more portal lies below', () => {
    expect(
      findPortalBottomTile(
        level([
          [TILE_AIR, TILE_PORTAL],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 1, y: 0 },
      ),
    ).toEqual({ x: 1, y: 1 });
  });

  it('should stay where it stands when nothing below is portal', () => {
    expect(
      findPortalBottomTile(
        level([
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 1, y: 0 },
      ),
    ).toEqual({ x: 1, y: 0 });
  });

  it('should walk all the way to the foot when the portal runs several tiles tall', () => {
    expect(
      findPortalBottomTile(
        level([
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

  it('should stop at the bottom row when the portal reaches the edge of the level', () => {
    expect(
      findPortalBottomTile(level([[TILE_PORTAL], [TILE_PORTAL]]), {
        x: 0,
        y: 0,
      }),
    ).toEqual({ x: 0, y: 1 });
  });

  it('should hold its column when the portal below sits in the next one over', () => {
    expect(
      findPortalBottomTile(
        level([
          [TILE_PORTAL, TILE_AIR],
          [TILE_AIR, TILE_PORTAL],
          [TILE_DIRT, TILE_DIRT],
        ]),
        { x: 0, y: 0 },
      ),
    ).toEqual({ x: 0, y: 0 });
  });

  it('should leave the tile where it found it when the tile is no portal at all', () => {
    expect(
      findPortalBottomTile(level([[TILE_AIR], [TILE_DIRT]]), { x: 0, y: 0 }),
    ).toEqual({ x: 0, y: 0 });
  });
});
