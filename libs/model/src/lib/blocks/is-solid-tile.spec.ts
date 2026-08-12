import { some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/air';
import { TILE_CHEST } from '../chest/chest';
import { TILE_DIAMOND } from '../diamond/diamond';
import { TILE_ENEMY } from '../enemies/enemy-spawn';
import { TILE_KEY } from '../key/key';
import { TILE_SPAWN } from '../player/spawn';
import { TILE_PORTAL } from '../portal/portal';
import { TILE_SPIKE, TILE_SPIKE_CEILING } from '../spike/spike';
import { TILE_BRICK } from './brick';
import { TILE_CANNON } from './cannon';
import { TILE_CERAMIC } from './ceramic';
import { TILE_DIRT } from './dirt';
import { isSolidTile } from './is-solid-tile';
import { TILE_STONE } from './stone';
import { TILE_WOOD } from './wood';

describe('isSolidTile', () => {
  it('should return true when the tile is solid terrain', () => {
    expect(isSolidTile(TILE_DIRT)).toBe(true);
    expect(isSolidTile(TILE_BRICK)).toBe(true);
    expect(isSolidTile(TILE_STONE)).toBe(true);
    expect(isSolidTile(TILE_WOOD)).toBe(true);
    expect(isSolidTile(TILE_CERAMIC)).toBe(true);
  });

  it('should return true when the tile is a cannon the player can stand on', () => {
    expect(isSolidTile(TILE_CANNON)).toBe(true);
  });

  it('should return false when the tile is non-blocking or interactive', () => {
    expect(
      some(
        [
          TILE_AIR,
          TILE_SPIKE,
          TILE_SPIKE_CEILING,
          TILE_CHEST,
          TILE_KEY,
          TILE_PORTAL,
          TILE_ENEMY,
          TILE_SPAWN,
          TILE_DIAMOND,
        ],
        isSolidTile,
      ),
    ).toBe(false);
  });

  it('should return false when the tile is unmapped', () => {
    expect(isSolidTile(99999)).toBe(false);
  });
});
