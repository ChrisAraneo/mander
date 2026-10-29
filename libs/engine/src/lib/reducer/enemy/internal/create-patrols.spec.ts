import {
  type Enemy,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import {
  filter,
  find,
  head,
  map,
  repeat,
  size,
  sortBy,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import {
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  FAST_ENEMY_CHANCE,
  FAST_ENEMY_MOVE_SPEED,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
  SHOOTER_ENEMY_CHANCE,
  SHOOTER_ENEMY_MOVE_SPEED,
  SHOOTER_RELOAD_SECONDS,
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
  shooterEnemyChance: 0,
});

const GROUND_LEVEL = createLevel(['.....', '..e..', '#####']);

const AIR_LEVEL = createLevel(['..e..', '.....', '#####']);

const CROWDED_LEVEL = createLevel([
  repeat('.', 22),
  `.${repeat('e', 20)}.`,
  repeat('#', 22),
]);

const SKY_LEVEL = createLevel([
  repeat('.', 22),
  `.${repeat('e', 20)}.`,
  repeat('.', 22),
  repeat('#', 22),
]);

const HUGE_LEVEL = createLevel([
  repeat('.', 402),
  `.${repeat('e', 400)}.`,
  repeat('#', 402),
]);

const computeKinds = (level: GameLevel): Enemy['kind'][] =>
  map(createPatrols(level), (enemy) => enemy.kind);

const withShooters = (level: GameLevel): GameLevel => ({
  ...level,
  shooterEnemyChance: SHOOTER_ENEMY_CHANCE,
});

const computeShare = (level: GameLevel, kind: Enemy['kind']): number =>
  size(filter(computeKinds(level), (rolled) => rolled === kind)) / 400;

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
        timers: { death: null, reload: 0 },
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

  it('should make every ground enemy horned or fast when the horned chance is certain', () => {
    const level = { ...CROWDED_LEVEL, hornedEnemyChance: 1 };

    const kinds = computeKinds(level);

    expect(sortBy(uniq(kinds))).toEqual(['FAST', 'HORNED']);
  });

  it('should make every ground enemy hopping or fast when the horned chance is zero', () => {
    const kinds = computeKinds(CROWDED_LEVEL);

    expect(sortBy(uniq(kinds))).toEqual(['FAST', 'HOPPING']);
  });

  it('should spawn no shooters when the level does not roll for them', () => {
    const kinds = computeKinds({ ...CROWDED_LEVEL, hornedEnemyChance: 0.5 });

    expect(kinds).not.toContain('SHOOTER');
  });

  it('should mix shooters in when the level rolls for them', () => {
    const level = withShooters({ ...CROWDED_LEVEL, hornedEnemyChance: 0.5 });

    const kinds = computeKinds(level);

    expect(kinds).toContain('SHOOTER');
  });

  it('should make about a quarter of the ground enemies fast when the level has many enemies', () => {
    const level = { ...HUGE_LEVEL, hornedEnemyChance: 0.5 };

    const fastShare = computeShare(level, 'FAST');

    expect(fastShare).toBeGreaterThan(FAST_ENEMY_CHANCE - 0.05);
    expect(fastShare).toBeLessThan(FAST_ENEMY_CHANCE + 0.05);
  });

  it('should leave fewer ground enemies fast when the level rolls for shooters too', () => {
    const level = withShooters({ ...HUGE_LEVEL, hornedEnemyChance: 0.5 });
    const expected = (1 - SHOOTER_ENEMY_CHANCE) * FAST_ENEMY_CHANCE;

    const fastShare = computeShare(level, 'FAST');

    expect(fastShare).toBeGreaterThan(expected - 0.05);
    expect(fastShare).toBeLessThan(expected + 0.05);
  });

  it('should make about a seventh of the ground enemies shooters when the level rolls for them', () => {
    const level = withShooters({ ...HUGE_LEVEL, hornedEnemyChance: 0.5 });

    const shooterShare = computeShare(level, 'SHOOTER');

    expect(shooterShare).toBeGreaterThan(SHOOTER_ENEMY_CHANCE - 0.05);
    expect(shooterShare).toBeLessThan(SHOOTER_ENEMY_CHANCE + 0.05);
  });

  it('should make no flying enemy fast or a shooter when the level has many flying enemies', () => {
    const kinds = computeKinds(SKY_LEVEL);

    expect(kinds).toEqual(times(20, () => 'FLYING'));
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

  it('should give a fast enemy the fast walking speed and the horned jump when it is set', () => {
    const enemy = find(createPatrols(CROWDED_LEVEL), { kind: 'FAST' });

    expect(enemy?.velocity).toEqual({
      x: { current: 0, max: FAST_ENEMY_MOVE_SPEED },
      y: { current: 0, max: HORNED_ENEMY_JUMP_VELOCITY },
    });
  });

  it('should give a shooter enemy the slow walking speed and the horned jump when it is set', () => {
    const enemy = find(createPatrols(withShooters(CROWDED_LEVEL)), {
      kind: 'SHOOTER',
    });

    expect(enemy?.velocity).toEqual({
      x: { current: 0, max: SHOOTER_ENEMY_MOVE_SPEED },
      y: { current: 0, max: HORNED_ENEMY_JUMP_VELOCITY },
    });
  });

  it('should give a shooter enemy a full reload to wait out when it is set', () => {
    const enemy = find(createPatrols(withShooters(CROWDED_LEVEL)), {
      kind: 'SHOOTER',
    });

    expect(enemy?.timers).toEqual({
      death: null,
      reload: SHOOTER_RELOAD_SECONDS,
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
