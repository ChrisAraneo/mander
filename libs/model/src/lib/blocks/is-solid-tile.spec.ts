import { some } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_CHEST } from '../chest/tile-chest';
import { TILE_ENEMY } from '../enemies/tile-enemy';
import { TILE_GEM } from '../gem/tile-gem';
import { TILE_KEY } from '../key/tile-key';
import { TILE_SPAWN } from '../player/tile-spawn';
import { TILE_PORTAL } from '../portal/tile-portal';
import { TILE_SPIKE } from '../spike/tile-spike';
import { TILE_SPIKE_CEILING } from '../spike/tile-spike-ceiling';
import { isSolidTile } from './is-solid-tile';
import { TILE_BRICK } from './tile-brick';
import { TILE_CANNON } from './tile-cannon';
import { TILE_CANNON_TRIPLE } from './tile-cannon-triple';
import { TILE_CERAMIC } from './tile-ceramic';
import { TILE_DIRT } from './tile-dirt';
import { TILE_FIREBALL } from './tile-fireball';
import { TILE_ICE } from './tile-ice';
import { TILE_ICEBALL } from './tile-iceball';
import { TILE_PINKBALL } from './tile-pinkball';
import { TILE_SAND } from './tile-sand';
import { TILE_STONE } from './tile-stone';
import { TILE_WOOD } from './tile-wood';

describe('isSolidTile', () => {
  it('should return true when the tile is solid terrain', () => {
    expect(isSolidTile(TILE_DIRT)).toBe(true);
    expect(isSolidTile(TILE_BRICK)).toBe(true);
    expect(isSolidTile(TILE_STONE)).toBe(true);
    expect(isSolidTile(TILE_WOOD)).toBe(true);
    expect(isSolidTile(TILE_CERAMIC)).toBe(true);
  });

  it('should return true when the tile is an ice block', () => {
    expect(isSolidTile(TILE_ICE)).toBe(true);
  });

  it('should return true when the tile is a sand block', () => {
    expect(isSolidTile(TILE_SAND)).toBe(true);
  });

  it('should return true when the tile is a cannon the player can stand on', () => {
    expect(isSolidTile(TILE_CANNON)).toBe(true);
    expect(isSolidTile(TILE_CANNON_TRIPLE)).toBe(true);
  });

  it('should return true when the tile is a fireball block the player can stand on', () => {
    expect(isSolidTile(TILE_FIREBALL)).toBe(true);
  });

  it('should return true when the tile is an ice ball block the player can stand on', () => {
    expect(isSolidTile(TILE_ICEBALL)).toBe(true);
  });

  it('should return true when the tile is a pink ball block the player can stand on', () => {
    expect(isSolidTile(TILE_PINKBALL)).toBe(true);
  });

  it('should return false when the tile does not block or is a pickup', () => {
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
          TILE_GEM,
        ],
        isSolidTile,
      ),
    ).toBe(false);
  });

  it('should return false when the tile is unknown', () => {
    expect(isSolidTile(99999)).toBe(false);
  });
});
