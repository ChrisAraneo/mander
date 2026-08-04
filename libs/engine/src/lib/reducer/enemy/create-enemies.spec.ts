import { TILE_AIR, TILE_DIRT, TILE_ENEMY, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../game-level';

import {
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './consts';
import { createEnemies } from './create-enemies';

const levelWithEnemies = (
  seed: string,
  count: number,
  hornedEnemyChance = HORNED_ENEMY_CHANCE,
): GameLevel => {
  const width = count + 2;
  const tiles: Tile[][] = [
    Array.from({ length: width }, (): Tile => TILE_AIR),
    Array.from({ length: width }, (_, x): Tile =>
      x > 0 && x <= count ? TILE_ENEMY : TILE_AIR,
    ),
    Array.from({ length: width }, (): Tile => TILE_DIRT),
  ];
  return {
    seed,
    width,
    height: tiles.length,
    tiles,
    chestItems: [],
    hornedEnemyChance,
  };
};

const levelWithAirborneEnemies = (
  seed: string,
  count: number,
  hornedEnemyChance = HORNED_ENEMY_CHANCE,
): GameLevel => {
  const width = count + 2;
  const tiles: Tile[][] = [
    Array.from({ length: width }, (): Tile => TILE_AIR),
    Array.from({ length: width }, (_, x): Tile =>
      x > 0 && x <= count ? TILE_ENEMY : TILE_AIR,
    ),
    Array.from({ length: width }, (): Tile => TILE_AIR),
  ];
  return {
    seed,
    width,
    height: tiles.length,
    tiles,
    chestItems: [],
    hornedEnemyChance,
  };
};

describe('createEnemies', () => {
  it('is deterministic — the same level rolls the same kinds every time', () => {
    const level = levelWithEnemies('SEED-A', 40);
    const first = createEnemies(level).map((enemy) => enemy.kind);
    const second = createEnemies(level).map((enemy) => enemy.kind);
    expect(second).toEqual(first);
  });

  it('splits roughly 50/50 between standard and horned enemies over many spawns', () => {
    const level = levelWithEnemies('SEED-B', 200);
    const enemies = createEnemies(level);
    const hornedCount = enemies.filter(
      (enemy) => enemy.kind === 'HORNED',
    ).length;
    expect(enemies).toHaveLength(200);
    expect(hornedCount, 'not suspiciously rare').toBeGreaterThan(60);
    expect(hornedCount, 'not suspiciously common').toBeLessThan(140);
  });

  it('hatches nothing but standard enemies on a level that asks for no horned ones', () => {
    const level = levelWithEnemies('SEED-STANDARD-ONLY', 200, 0);
    const enemies = createEnemies(level);
    expect(enemies).toHaveLength(200);
    expect(enemies.every((enemy) => enemy.kind === 'STANDARD')).toBe(true);
  });

  it('hatches nothing but horned enemies on a level that asks for them alone', () => {
    const level = levelWithEnemies('SEED-HORNED-ONLY', 200, 1);
    const enemies = createEnemies(level);
    expect(enemies).toHaveLength(200);
    expect(enemies.every((enemy) => enemy.kind === 'HORNED')).toBe(true);
  });

  it('still spawns flying enemies in the air whatever the level asks of the ground', () => {
    const grounded = createEnemies(levelWithAirborneEnemies('SEED-AIR', 40, 0));
    const horned = createEnemies(levelWithAirborneEnemies('SEED-AIR', 40, 1));

    expect(grounded.every((enemy) => enemy.kind === 'FLYING')).toBe(true);
    expect(horned.every((enemy) => enemy.kind === 'FLYING')).toBe(true);
  });

  it('a different level seed can roll a different split', () => {
    const a = createEnemies(levelWithEnemies('SEED-C', 40)).map(
      (enemy) => enemy.kind,
    );
    const b = createEnemies(levelWithEnemies('SEED-D', 40)).map(
      (enemy) => enemy.kind,
    );
    expect(a).not.toEqual(b);
  });

  it('gives horned enemies a 30% lower jump than standard enemies', () => {
    const level = levelWithEnemies('SEED-E', 60);
    const enemies = createEnemies(level);
    const standard = enemies.find((enemy) => enemy.kind === 'STANDARD');
    const horned = enemies.find((enemy) => enemy.kind === 'HORNED');

    expect(standard?.velocity.y.max).toBe(ENEMY_JUMP_VELOCITY);
    expect(horned?.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
    expect(horned?.velocity.y.max).toBeCloseTo(ENEMY_JUMP_VELOCITY * 0.7);
  });

  it('spawns flying enemies on tiles with nothing solid beneath them', () => {
    const level = levelWithAirborneEnemies('SEED-FLY', 40);
    const enemies = createEnemies(level);
    expect(enemies).toHaveLength(40);
    expect(enemies.every((enemy) => enemy.kind === 'FLYING')).toBe(true);
  });

  it('never rolls a flying enemy on a tile with solid ground beneath it', () => {
    const level = levelWithEnemies('SEED-GROUND', 40);
    const enemies = createEnemies(level);
    expect(enemies.some((enemy) => enemy.kind === 'FLYING')).toBe(false);
  });

  it('gives flying enemies a vertical patrol speed instead of a jump velocity', () => {
    const level = levelWithAirborneEnemies('SEED-FLY-2', 5);
    const enemies = createEnemies(level);
    expect(
      enemies.every((enemy) => enemy.velocity.y.max === FLYING_ENEMY_MOVE_SPEED),
    ).toBe(true);
    expect(FLYING_ENEMY_MOVE_SPEED).toBeCloseTo(ENEMY_MOVE_SPEED * 0.75);
  });

  it('gives flying enemies no horizontal speed — they never move sideways', () => {
    const level = levelWithAirborneEnemies('SEED-FLY-3', 5);
    const enemies = createEnemies(level);
    expect(enemies.every((enemy) => enemy.velocity.x.max === 0)).toBe(true);
  });
});
