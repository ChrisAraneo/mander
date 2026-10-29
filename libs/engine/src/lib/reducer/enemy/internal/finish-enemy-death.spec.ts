import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
} from '../consts';
import { createPatrols } from './create-patrols';
import { finishEnemyDeath } from './finish-enemy-death';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '..e..', '#####']);

const createDyingEnemy = (): Enemy => ({
  ...createPatrols(LEVEL)[0],
  velocity: {
    x: { current: -ENEMY_MOVE_SPEED, max: ENEMY_MOVE_SPEED },
    y: { current: -120, max: ENEMY_JUMP_VELOCITY },
  },
  timers: { death: 0.1, reload: 0 },
  statuses: { isFacingRight: false, isGrounded: true },
});

describe('finishEnemyDeath', () => {
  it('should stop the enemy moving when its death is finished', () => {
    const enemy = createDyingEnemy();

    const finished = finishEnemyDeath(enemy);

    expect(finished.velocity).toEqual({
      x: { current: 0, max: ENEMY_MOVE_SPEED },
      y: { current: 0, max: ENEMY_JUMP_VELOCITY },
    });
  });

  it('should run the death clock out when its death is finished', () => {
    const enemy = createDyingEnemy();

    const finished = finishEnemyDeath(enemy);

    expect(finished.timers).toEqual({
      death: ENEMY_DEATH_SECONDS,
      reload: 0,
    });
  });

  it('should keep the kind, place, spawn and statuses when its death is finished', () => {
    const enemy = createDyingEnemy();

    const finished = finishEnemyDeath(enemy);

    expect(finished.kind).toBe(enemy.kind);
    expect(finished.position).toBe(enemy.position);
    expect(finished.spawn).toBe(enemy.spawn);
    expect(finished.statuses).toBe(enemy.statuses);
  });

  it('should leave the given enemy unchanged when its death is finished', () => {
    const enemy = createDyingEnemy();

    finishEnemyDeath(enemy);

    expect(enemy).toEqual(createDyingEnemy());
  });
});
