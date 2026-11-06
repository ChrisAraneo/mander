import {
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  TILE_ENEMY,
  TILE_ENEMY_FAST,
  TILE_ENEMY_FLYING,
  TILE_ENEMY_FREEZING,
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_SHOOTER,
  TILE_SAND,
} from '@mander/model';
import { forEach, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BRUSHES } from './brushes';

const SPECIFIC_ENEMIES = [
  TILE_ENEMY_HOPPING,
  TILE_ENEMY_HORNED,
  TILE_ENEMY_FAST,
  TILE_ENEMY_SHOOTER,
  TILE_ENEMY_FREEZING,
  TILE_ENEMY_FLYING,
];

describe('BRUSHES', () => {
  it('should offer the regular cannon when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).toContain(TILE_CANNON);
  });

  it('should offer no triple cannon when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).not.toContain(
      TILE_CANNON_TRIPLE,
    );
  });

  it('should offer no sand when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).not.toContain(TILE_SAND);
  });

  it('should offer the random enemy when the picker lists the brushes', () => {
    expect(map(BRUSHES, (brush) => brush.value)).toContain(TILE_ENEMY);
  });

  it('should offer no specific enemy when the picker lists the brushes', () => {
    const values = map(BRUSHES, (brush) => brush.value);

    forEach(SPECIFIC_ENEMIES, (enemy) => {
      expect(values).not.toContain(enemy);
    });
  });
});
