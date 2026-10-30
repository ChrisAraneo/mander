import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { isEnemyTile } from './is-enemy-tile';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY } from './tile-enemy';
import { TILE_ENEMY_FAST } from './tile-enemy-fast';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_HOPPING } from './tile-enemy-hopping';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';
import { TILE_ENEMY_SHOOTER } from './tile-enemy-shooter';

describe('isEnemyTile', () => {
  it('should own the tile when it is the spawn the generator still has to pick for', () => {
    expect(isEnemyTile(TILE_ENEMY)).toBe(true);
  });

  it('should own the tile when it names a walking enemy', () => {
    expect(isEnemyTile(TILE_ENEMY_HOPPING)).toBe(true);
    expect(isEnemyTile(TILE_ENEMY_HORNED)).toBe(true);
    expect(isEnemyTile(TILE_ENEMY_FAST)).toBe(true);
    expect(isEnemyTile(TILE_ENEMY_SHOOTER)).toBe(true);
  });

  it('should own the tile when it names a flying enemy', () => {
    expect(isEnemyTile(TILE_ENEMY_FLYING)).toBe(true);
  });

  it('should turn the tile away when it is a beartrap, which never patrols', () => {
    expect(isEnemyTile(TILE_BEARTRAP)).toBe(false);
  });

  it('should turn the tile away when nothing spawns on it', () => {
    expect(isEnemyTile(TILE_AIR)).toBe(false);
    expect(isEnemyTile(TILE_DIRT)).toBe(false);
  });
});
