import { describe, expect, it } from 'vitest';

import { TILE_AIR } from '../air/tile-air';
import { TILE_DIRT } from '../blocks/tile-dirt';
import { TILE_BEARTRAP } from './tile-beartrap';
import { TILE_ENEMY } from './tile-enemy';
import { TILE_ENEMY_FAST } from './tile-enemy-fast';
import { TILE_ENEMY_FLYING } from './tile-enemy-flying';
import { TILE_ENEMY_FREEZING } from './tile-enemy-freezing';
import { TILE_ENEMY_HOPPING } from './tile-enemy-hopping';
import { TILE_ENEMY_HORNED } from './tile-enemy-horned';
import { TILE_ENEMY_SHOOTER } from './tile-enemy-shooter';
import { toTileEnemyKind } from './to-tile-enemy-kind';

describe('toTileEnemyKind', () => {
  it('should name the walking enemy when the tile stands for one', () => {
    expect(toTileEnemyKind(TILE_ENEMY_HOPPING)).toBe('HOPPING');
    expect(toTileEnemyKind(TILE_ENEMY_HORNED)).toBe('HORNED');
    expect(toTileEnemyKind(TILE_ENEMY_FAST)).toBe('FAST');
    expect(toTileEnemyKind(TILE_ENEMY_SHOOTER)).toBe('SHOOTER');
    expect(toTileEnemyKind(TILE_ENEMY_FREEZING)).toBe('FREEZING');
  });

  it('should name the flying enemy when the tile stands for one', () => {
    expect(toTileEnemyKind(TILE_ENEMY_FLYING)).toBe('FLYING');
  });

  it('should name the beartrap when the tile stands for one', () => {
    expect(toTileEnemyKind(TILE_BEARTRAP)).toBe('BEARTRAP');
  });

  it('should name nothing when the tile leaves the kind to the level', () => {
    expect(toTileEnemyKind(TILE_ENEMY)).toBeNull();
  });

  it('should name nothing when no enemy spawns on the tile', () => {
    expect(toTileEnemyKind(TILE_AIR)).toBeNull();
    expect(toTileEnemyKind(TILE_DIRT)).toBeNull();
  });
});
