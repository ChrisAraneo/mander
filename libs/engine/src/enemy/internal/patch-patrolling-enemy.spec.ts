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

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const ENEMY_LEFT = 37;
const ON_SPIKE_TOP = 70;
const CLEAR_OF_SPIKE_TOP = 10;
const TICK_SECONDS = 0.02;
const DEATH_STARTED = 0;
const NO_SPEED = 0;

const LEVEL = createLevel(['.e.', '...', '.^.', '###']);

const BASE_ENEMY = createPatrols(LEVEL)[0];

const PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createEnemyAt = (top: number): Enemy => ({
  ...BASE_ENEMY,
  position: { x: ENEMY_LEFT, y: top },
  spawn: { x: ENEMY_LEFT, y: top },
});

describe('patchPatrollingEnemy', () => {
  it('should start the death of the enemy when its step ends on a spike', () => {
    const enemy = createEnemyAt(ON_SPIKE_TOP);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS);

    expect(patched.timers.death).toBe(DEATH_STARTED);
    expect(patched.velocity.x.current).toBe(NO_SPEED);
  });

  it('should give the stepped enemy on its way to dying when its step ends on a spike', () => {
    const enemy = createEnemyAt(ON_SPIKE_TOP);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS);

    expect(patched).toEqual(
      startEnemyDeath(patchLivingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS)),
    );
  });

  it('should give the stepped enemy when its step ends clear of every spike', () => {
    const enemy = createEnemyAt(CLEAR_OF_SPIKE_TOP);

    const patched = patchPatrollingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS);

    expect(patched).toEqual(
      patchLivingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS),
    );
    expect(patched.timers.death).toBe(null);
  });

  it('should leave the given enemy unchanged when its step ends on a spike', () => {
    const enemy = createEnemyAt(ON_SPIKE_TOP);

    patchPatrollingEnemy(LEVEL, enemy, PLAYER, TICK_SECONDS);

    expect(enemy).toEqual(createEnemyAt(ON_SPIKE_TOP));
  });
});
