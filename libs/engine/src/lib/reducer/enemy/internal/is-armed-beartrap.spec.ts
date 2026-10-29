import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createBeartraps } from './create-beartraps';
import { isArmedBeartrap } from './is-armed-beartrap';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  b: TILE_BEARTRAP,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const BEARTRAP: Enemy = createBeartraps(
  createLevel(['.....', '..b..', '#####']),
)[0];

describe('isArmedBeartrap', () => {
  it('should say yes when the enemy is a living beartrap', () => {
    const isArmed = isArmedBeartrap(BEARTRAP);

    expect(isArmed).toBe(true);
  });

  it('should say no when the beartrap is dying', () => {
    const enemy: Enemy = { ...BEARTRAP, timers: { death: 0.1, reload: 0 } };

    const isArmed = isArmedBeartrap(enemy);

    expect(isArmed).toBe(false);
  });

  it('should say no when the enemy is a living hopping enemy', () => {
    const enemy: Enemy = { ...BEARTRAP, kind: 'HOPPING' };

    const isArmed = isArmedBeartrap(enemy);

    expect(isArmed).toBe(false);
  });

  it('should say no when the enemy is a living horned enemy', () => {
    const enemy: Enemy = { ...BEARTRAP, kind: 'HORNED' };

    const isArmed = isArmedBeartrap(enemy);

    expect(isArmed).toBe(false);
  });

  it('should say no when the enemy is a living flying enemy', () => {
    const enemy: Enemy = { ...BEARTRAP, kind: 'FLYING' };

    const isArmed = isArmedBeartrap(enemy);

    expect(isArmed).toBe(false);
  });
});
