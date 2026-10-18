import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { ENEMY_JUMP_VELOCITY, ENEMY_MOVE_SPEED } from './consts';
import { createEnemies } from './create-enemies';
import { startEnemyDeath } from './start-enemy-death';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  e: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createWalkingEnemy = (): Enemy => ({
  ...createEnemies(LEVEL)[0],
  velocity: {
    x: { current: -ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: -120, max: ENEMY_JUMP_VELOCITY },
  },
  statuses: { isFacingRight: false, isGrounded: false },
});

describe('startEnemyDeath', () => {
  it('should stop the enemy walking when it starts to die', () => {
    const enemy = createWalkingEnemy();

    const dying = startEnemyDeath(enemy);

    expect(dying.velocity.x).toEqual({ current: 0, max: ENEMY_MOVE_SPEED });
  });

  it('should start the death clock at zero when the enemy starts to die', () => {
    const enemy = createWalkingEnemy();

    const dying = startEnemyDeath(enemy);

    expect(dying.timers).toEqual({ death: 0 });
  });

  it('should keep the same rise or fall when the enemy starts to die', () => {
    const enemy = createWalkingEnemy();

    const dying = startEnemyDeath(enemy);

    expect(dying.velocity.y).toBe(enemy.velocity.y);
  });

  it('should keep the kind, place, spawn and statuses when the enemy starts to die', () => {
    const enemy = createWalkingEnemy();

    const dying = startEnemyDeath(enemy);

    expect(dying.kind).toBe(enemy.kind);
    expect(dying.position).toBe(enemy.position);
    expect(dying.spawn).toBe(enemy.spawn);
    expect(dying.statuses).toBe(enemy.statuses);
  });

  it('should leave the given enemy unchanged when it starts to die', () => {
    const enemy = createWalkingEnemy();

    startEnemyDeath(enemy);

    expect(enemy).toEqual(createWalkingEnemy());
  });
});
