import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPIKE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import { startEnemyDeath } from '../start-enemy-death';
import { createPatrols } from './create-patrols';
import { patchLivingEnemy } from './patch-living-enemy';
import { patchPatrollingEnemy } from './patch-patrolling-enemy';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
  '^': TILE_SPIKE,
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

const LEVEL = createLevel(['.e.', '...', '.^.', '###']);

const BASE_ENEMY = createPatrols(LEVEL)[0];

const PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createEnemyAt = (top: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: 37, y: top },
  spawn: { x: 37, y: top },
});

describe('patchPatrollingEnemy', () => {
  it('should start the death of the enemy when its step ends on a spike', () => {
    const enemy = createEnemyAt(70);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, 0.02);

    expect(patched.timers.death).toBe(0);
    expect(patched.velocity.x.current).toBe(0);
  });

  it('should give the stepped enemy on its way to dying when its step ends on a spike', () => {
    const enemy = createEnemyAt(70);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, 0.02);

    expect(patched).toEqual(
      startEnemyDeath(patchLivingEnemy(LEVEL, enemy, PLAYER, 0.02)),
    );
  });

  it('should give the stepped enemy when its step ends clear of every spike', () => {
    const enemy = createEnemyAt(10);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, 0.02);

    expect(patched).toEqual(patchLivingEnemy(LEVEL, enemy, PLAYER, 0.02));
    expect(patched.timers.death).toBeNull();
  });

  it('should leave the given enemy unchanged when its step ends on a spike', () => {
    const enemy = createEnemyAt(70);

    patchPatrollingEnemy(LEVEL, enemy, PLAYER, 0.02);

    expect(enemy).toEqual(createEnemyAt(70));
  });
});
