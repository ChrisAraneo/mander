import { type Level, type Tile, TILE_AIR, TILE_BEARTRAP, TILE_DIRT, TILE_ENEMY, TILE_SIZE, chain } from '@mander/model';
import { every, filter, find, map, size, some, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import {
  BEARTRAP_JUMP_VELOCITY,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './consts';
import { createEnemies } from './create-enemies';

const createLevelWithEnemies = (
  seed: string,
  count: number,
  hornedEnemyChance = HORNED_ENEMY_CHANCE,
): GameLevel =>
  chain(count + 2)
    .thru((width) => ({
      width,
      tiles: [
        times(width, (): Tile => TILE_AIR),
        times(width, (column) =>
          match(column > 0 && column <= count)
            .with(true, (): Tile => TILE_ENEMY)
            .otherwise((): Tile => TILE_AIR),
        ),
        times(width, (): Tile => TILE_DIRT),
      ],
    }))
    .thru(({ width, tiles }): GameLevel => ({
      seed,
      width,
      height: size(tiles),
      tiles,
      chestItems: [],
      hornedEnemyChance,
    }))
    .value();

const createLevelWithAirborneEnemies = (
  seed: string,
  count: number,
  hornedEnemyChance = HORNED_ENEMY_CHANCE,
): GameLevel =>
  chain(count + 2)
    .thru((width) => ({
      width,
      tiles: [
        times(width, (): Tile => TILE_AIR),
        times(width, (column) =>
          match(column > 0 && column <= count)
            .with(true, (): Tile => TILE_ENEMY)
            .otherwise((): Tile => TILE_AIR),
        ),
        times(width, (): Tile => TILE_AIR),
      ],
    }))
    .thru(({ width, tiles }): GameLevel => ({
      seed,
      width,
      height: size(tiles),
      tiles,
      chestItems: [],
      hornedEnemyChance,
    }))
    .value();

const WIDTH = 20;

const HEIGHT = 14;

const FLOOR_ROW = 12;

const TRAP_ROW = FLOOR_ROW - 1;

const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isFloor: row >= FLOOR_ROW,
        isTrap: row === TRAP_ROW && column === TRAP_COLUMN,
      })
        .with({ isFloor: true }, (): Tile => TILE_DIRT)
        .with({ isTrap: true }, (): Tile => TILE_BEARTRAP)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createArena = (): GameLevel => ({
  ...createRoom(),
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

describe('createEnemies', () => {
  it('should roll the same kinds every time when the level is the same', () => {
    const level = createLevelWithEnemies('SEED-A', 40);
    const first = map(createEnemies(level), (enemy) => enemy.kind);
    const second = map(createEnemies(level), (enemy) => enemy.kind);

    expect(second).toEqual(first);
  });

  it('should split roughly half and half between hopping and horned when the level spawns many', () => {
    const level = createLevelWithEnemies('SEED-B', 200);
    const enemies = createEnemies(level);
    const hornedCount = size(
      filter(enemies, (enemy) => enemy.kind === 'HORNED'),
    );

    expect(enemies).toHaveLength(200);
    expect(hornedCount, 'not suspiciously rare').toBeGreaterThan(60);
    expect(hornedCount, 'not suspiciously common').toBeLessThan(140);
  });

  it('should hatch nothing but hopping enemies when the level asks for no horned ones', () => {
    const level = createLevelWithEnemies('SEED-HOPPING-ONLY', 200, 0);
    const enemies = createEnemies(level);

    expect(enemies).toHaveLength(200);
    expect(every(enemies, (enemy) => enemy.kind === 'HOPPING')).toBe(true);
  });

  it('should hatch nothing but horned enemies when the level asks for them alone', () => {
    const level = createLevelWithEnemies('SEED-HORNED-ONLY', 200, 1);
    const enemies = createEnemies(level);

    expect(enemies).toHaveLength(200);
    expect(every(enemies, (enemy) => enemy.kind === 'HORNED')).toBe(true);
  });

  it('should still spawn flying enemies in the air when the level asks something else of the ground', () => {
    const grounded = createEnemies(
      createLevelWithAirborneEnemies('SEED-AIR', 40, 0),
    );
    const horned = createEnemies(
      createLevelWithAirborneEnemies('SEED-AIR', 40, 1),
    );

    expect(every(grounded, (enemy) => enemy.kind === 'FLYING')).toBe(true);
    expect(every(horned, (enemy) => enemy.kind === 'FLYING')).toBe(true);
  });

  it('should roll a different split when the level seed differs', () => {
    const kinds = map(
      createEnemies(createLevelWithEnemies('SEED-C', 40)),
      (enemy) => enemy.kind,
    );
    const otherKinds = map(
      createEnemies(createLevelWithEnemies('SEED-D', 40)),
      (enemy) => enemy.kind,
    );

    expect(kinds).not.toEqual(otherKinds);
  });

  it('should give the enemy a jump 30% lower than a hopping one when it is horned', () => {
    const level = createLevelWithEnemies('SEED-E', 60);
    const enemies = createEnemies(level);
    const hopping = find(enemies, (enemy) => enemy.kind === 'HOPPING');
    const horned = find(enemies, (enemy) => enemy.kind === 'HORNED');

    expect(hopping?.velocity.y.max).toBe(ENEMY_JUMP_VELOCITY);
    expect(horned?.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
    expect(horned?.velocity.y.max).toBeCloseTo(ENEMY_JUMP_VELOCITY * 0.7);
  });

  it('should spawn a flying enemy when nothing solid lies beneath its tile', () => {
    const level = createLevelWithAirborneEnemies('SEED-FLY', 40);
    const enemies = createEnemies(level);

    expect(enemies).toHaveLength(40);
    expect(every(enemies, (enemy) => enemy.kind === 'FLYING')).toBe(true);
  });

  it('should never roll a flying enemy when solid ground lies beneath its tile', () => {
    const level = createLevelWithEnemies('SEED-GROUND', 40);
    const enemies = createEnemies(level);

    expect(some(enemies, (enemy) => enemy.kind === 'FLYING')).toBe(false);
  });

  it('should give the enemy a vertical patrol speed rather than a jump when it flies', () => {
    const level = createLevelWithAirborneEnemies('SEED-FLY-2', 5);
    const enemies = createEnemies(level);

    expect(
      every(
        enemies,
        (enemy) => enemy.velocity.y.max === FLYING_ENEMY_MOVE_SPEED,
      ),
    ).toBe(true);
    expect(FLYING_ENEMY_MOVE_SPEED).toBeCloseTo(ENEMY_MOVE_SPEED * 0.75);
  });

  it('should give the enemy no horizontal speed when it flies', () => {
    const level = createLevelWithAirborneEnemies('SEED-FLY-3', 5);
    const enemies = createEnemies(level);

    expect(every(enemies, (enemy) => enemy.velocity.x.max === 0)).toBe(true);
  });

  it('should lay a beartrap on the solid block beneath the tile when a tile asks for one', () => {
    expect(createEnemies(createArena())).toEqual([
      {
        kind: 'BEARTRAP',
        position: { x: TRAP_X, y: TRAP_Y },
        velocity: {
          x: { current: 0, max: 0 },
          y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
        },
        timers: { death: null },
        spawn: { x: TRAP_X, y: TRAP_Y },
        statuses: { isFacingRight: true, isGrounded: false },
      },
    ]);
  });

  it('should lay nothing when the room holds no such tile', () => {
    const bare = createArena();
    bare.tiles[TRAP_ROW][TRAP_COLUMN] = TILE_AIR;

    expect(createEnemies(bare)).toEqual([]);
  });
});
