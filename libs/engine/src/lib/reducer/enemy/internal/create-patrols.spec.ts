import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, repeat, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import {
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from '../consts';
import { createPatrols } from './create-patrols';

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
});

const GROUND_LEVEL = createLevel(['.....', '..e..', '#####']);

const AIR_LEVEL = createLevel(['..e..', '.....', '#####']);

const CROWDED_LEVEL = createLevel([
  repeat('.', 22),
  `.${repeat('e', 20)}.`,
  repeat('#', 22),
]);

const computeKinds = (level: GameLevel): Enemy['kind'][] =>
  map(createPatrols(level), (enemy) => enemy.kind);

describe('createPatrols', () => {
  it('should set a hopping enemy on its spawn point when the enemy tile stands on solid ground', () => {
    const patrols = createPatrols(GROUND_LEVEL);

    expect(patrols).toEqual([
      {
        kind: 'HOPPING',
        position: { x: 69, y: 42 },
        velocity: {
          x: { current: 0, max: ENEMY_MOVE_SPEED },
          y: { current: 0, max: ENEMY_JUMP_VELOCITY },
        },
        timers: { death: null },
        spawn: { x: 69, y: 42 },
        statuses: { isFacingRight: true, isGrounded: false },
      },
    ]);
  });

  it('should make the enemy fly when the enemy tile stands above air', () => {
    const kinds = computeKinds(AIR_LEVEL);

    expect(kinds).toEqual(['FLYING']);
  });

  it('should make the enemy fly even when every ground enemy is horned', () => {
    const level = { ...AIR_LEVEL, hornedEnemyChance: 1 };

    const kinds = computeKinds(level);

    expect(kinds).toEqual(['FLYING']);
  });

  it('should make every ground enemy horned when the horned chance is certain', () => {
    const level = { ...CROWDED_LEVEL, hornedEnemyChance: 1 };

    const kinds = computeKinds(level);

    expect(kinds).toEqual(times(20, () => 'HORNED'));
  });

  it('should make every ground enemy hopping when the horned chance is zero', () => {
    const kinds = computeKinds(CROWDED_LEVEL);

    expect(kinds).toEqual(times(20, () => 'HOPPING'));
  });

  it('should give the same enemies when the same level is read twice', () => {
    const level = { ...CROWDED_LEVEL, hornedEnemyChance: 0.5 };

    const first = createPatrols(level);
    const second = createPatrols(level);

    expect(first).toEqual(second);
  });

  it('should give a different mix of horned and hopping enemies when the seed differs', () => {
    const level = { ...CROWDED_LEVEL, hornedEnemyChance: 0.5 };
    const otherLevel = { ...level, seed: 'OTHER' };

    const kinds = computeKinds(level);
    const otherKinds = computeKinds(otherLevel);

    expect(kinds).not.toEqual(otherKinds);
  });

  it('should give a hopping enemy its walking speed and jump when it is set', () => {
    const [enemy] = createPatrols(GROUND_LEVEL);

    expect(enemy.velocity).toEqual({
      x: { current: 0, max: ENEMY_MOVE_SPEED },
      y: { current: 0, max: ENEMY_JUMP_VELOCITY },
    });
  });

  it('should give a horned enemy its walking speed and lower jump when it is set', () => {
    const level = { ...GROUND_LEVEL, hornedEnemyChance: 1 };

    const [enemy] = createPatrols(level);

    expect(enemy.velocity).toEqual({
      x: { current: 0, max: ENEMY_MOVE_SPEED },
      y: { current: 0, max: HORNED_ENEMY_JUMP_VELOCITY },
    });
  });

  it('should give a flying enemy no walking speed and its flying speed when it is set', () => {
    const [enemy] = createPatrols(AIR_LEVEL);

    expect(enemy.velocity).toEqual({
      x: { current: 0, max: 0 },
      y: { current: 0, max: FLYING_ENEMY_MOVE_SPEED },
    });
  });

  it('should set no enemies when the level only has beartrap tiles', () => {
    const level = createLevel(['.....', '..b..', '#####']);

    const patrols = createPatrols(level);

    expect(patrols).toEqual([]);
  });
});
