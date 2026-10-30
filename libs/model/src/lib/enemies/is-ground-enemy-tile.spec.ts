import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { isGroundEnemyTile } from './is-ground-enemy-tile';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY } from './tile-enemy';
import { TILE_ENEMY_FAST } from './tile-enemy-fast';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_HOPPING } from './tile-enemy-hopping';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';
import { TILE_ENEMY_SHOOTER } from './tile-enemy-shooter';

describe('isGroundEnemyTile', () => {
  it('should own the tile when the enemy it names walks the ground', () => {
    expect(isGroundEnemyTile(TILE_ENEMY_HOPPING)).toBe(true);
    expect(isGroundEnemyTile(TILE_ENEMY_HORNED)).toBe(true);
    expect(isGroundEnemyTile(TILE_ENEMY_FAST)).toBe(true);
    expect(isGroundEnemyTile(TILE_ENEMY_SHOOTER)).toBe(true);
  });

  it('should turn the tile away when the enemy it names flies', () => {
    expect(isGroundEnemyTile(TILE_ENEMY_FLYING)).toBe(false);
  });

  it('should turn the tile away when it names no enemy of its own', () => {
    expect(isGroundEnemyTile(TILE_ENEMY)).toBe(false);
  });

  it('should turn the tile away when it is a beartrap, which never walks', () => {
    expect(isGroundEnemyTile(TILE_BEARTRAP)).toBe(false);
  });

  it('should turn the tile away when nothing spawns on it', () => {
    expect(isGroundEnemyTile(TILE_AIR)).toBe(false);
  });
});
