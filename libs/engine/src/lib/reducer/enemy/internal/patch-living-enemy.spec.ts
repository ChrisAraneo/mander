import {
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { nextBeartrap } from '../next-beartrap';
import { nextEnemy } from '../next-enemy';
import { createBeartraps } from './create-beartraps';
import { createPatrol } from './create-patrol';
import { createPatrols } from './create-patrols';
import { patchFlyingEnemy } from './patch-flying-enemy';
import { patchLivingEnemy } from './patch-living-enemy';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  b: TILE_BEARTRAP,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const SKY_LEVEL = createLevel(['.....', '..e..', '.....', '.....', '#####']);

const GROUND_LEVEL = createLevel(['.....', '.....', '..e..', '#####']);

const HORNED_LEVEL: GameLevel = { ...GROUND_LEVEL, hornedEnemyChance: 1 };

const TRAP_LEVEL = createLevel(['.....', '.....', '..b..', '#####']);

const PLAYER = createPlayer(GROUND_LEVEL, { hearts: { value: BASE_HEARTS } });

describe('patchLivingEnemy', () => {
  it('should fly the enemy when it is a flying enemy', () => {
    const enemy = createPatrols(SKY_LEVEL)[0];

    const patched = patchLivingEnemy(SKY_LEVEL, enemy, PLAYER, 0.02);

    expect(enemy.kind).toBe('FLYING');
    expect(patched).toEqual(patchFlyingEnemy(SKY_LEVEL, enemy, 0.02));
  });

  it('should step the trap when it is a beartrap', () => {
    const trap = createBeartraps(TRAP_LEVEL)[0];

    const patched = patchLivingEnemy(TRAP_LEVEL, trap, PLAYER, 0.02);

    expect(trap.kind).toBe('BEARTRAP');
    expect(patched).toEqual(nextBeartrap(TRAP_LEVEL, trap, PLAYER, 0.02));
  });

  it('should walk the enemy when it is a hopping enemy', () => {
    const enemy = createPatrols(GROUND_LEVEL)[0];

    const patched = patchLivingEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02);

    expect(enemy.kind).toBe('HOPPING');
    expect(patched).toEqual(nextEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02));
  });

  it('should walk the enemy when it is a horned enemy', () => {
    const enemy = createPatrols(HORNED_LEVEL)[0];

    const patched = patchLivingEnemy(HORNED_LEVEL, enemy, PLAYER, 0.02);

    expect(enemy.kind).toBe('HORNED');
    expect(patched).toEqual(nextEnemy(HORNED_LEVEL, enemy, PLAYER, 0.02));
  });

  it('should walk the enemy when it is a fast enemy', () => {
    const enemy = createPatrol(createPatrols(GROUND_LEVEL)[0].spawn, 'FAST');

    const patched = patchLivingEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02);

    expect(patched).toEqual(nextEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02));
  });

  it('should walk the enemy when it is a shooter enemy', () => {
    const enemy = createPatrol(createPatrols(GROUND_LEVEL)[0].spawn, 'SHOOTER');

    const patched = patchLivingEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02);

    expect(patched).toEqual(nextEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02));
  });

  it('should walk the enemy when it is a freezing enemy', () => {
    const enemy = createPatrol(
      createPatrols(GROUND_LEVEL)[0].spawn,
      'FREEZING',
    );

    const patched = patchLivingEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02);

    expect(patched).toEqual(nextEnemy(GROUND_LEVEL, enemy, PLAYER, 0.02));
  });
});
