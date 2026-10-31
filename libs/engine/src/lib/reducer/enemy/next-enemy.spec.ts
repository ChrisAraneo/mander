import {
  type Enemy,
  GRAVITY,
  MAX_TICK_SECONDS,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { PLAYER_HEIGHT } from '../player/consts';
import { createPlayer } from '../player/create-player';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
} from './consts';
import { createEnemies } from './create-enemies';
import { nextEnemy } from './next-enemy';

const DELTA_SECONDS = 1 / 60;

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
  freezingEnemyChance: 0,
});

const FLAT_LEVEL = createLevel([
  '..........',
  '..........',
  '....e.....',
  '##########',
]);

const WALL_LEVEL = createLevel(['......', '......', '...e#.', '######']);

const LEDGE_LEVEL = createLevel(['......', '......', '.e....', '##....']);

const createEnemyIn = (
  level: GameLevel,
  left: number,
  top: number,
  isGrounded: boolean,
): Enemy => ({
  ...createEnemies(level)[0],
  position: { x: left, y: top },
  statuses: { isFacingRight: true, isGrounded },
});

const createPlayerAt = (left: number, top: number): Player => ({
  ...createPlayer(FLAT_LEVEL, { hearts: { value: 3 } }),
  position: { x: left, y: top },
});

const FAR_PLAYER = createPlayerAt(600, 0);

describe('nextEnemy', () => {
  it('should walk right at its own speed when it stands on flat ground facing right', () => {
    const enemy = createEnemyIn(FLAT_LEVEL, 133, 74, true);

    const stepped = nextEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, 0.1);

    expect(stepped.position.x).toBeCloseTo(
      133 + ENEMY_MOVE_SPEED * MAX_TICK_SECONDS,
      6,
    );
    expect(stepped.position.y).toBe(74);
    expect(stepped.velocity.x.current).toBe(ENEMY_MOVE_SPEED);
    expect(stepped.statuses).toEqual({
      isFacingRight: true,
      isGrounded: true,
    });
  });

  it('should turn to face left when it walks into a wall', () => {
    const enemy = createEnemyIn(WALL_LEVEL, 106, 74, true);

    const stepped = nextEnemy(WALL_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(stepped.statuses.isFacingRight).toBe(false);
    expect(stepped.velocity.x.current).toBe(-ENEMY_MOVE_SPEED);
    expect(stepped.position.x).toBeCloseTo(
      106 - ENEMY_MOVE_SPEED * DELTA_SECONDS,
      6,
    );
  });

  it('should turn back when it reaches a ledge while standing on the ground', () => {
    const enemy = createEnemyIn(LEDGE_LEVEL, 45, 74, true);

    const stepped = nextEnemy(LEDGE_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(stepped.statuses.isFacingRight).toBe(false);
    expect(stepped.position.x).toBeCloseTo(
      45 - ENEMY_MOVE_SPEED * DELTA_SECONDS,
      6,
    );
  });

  it('should keep its way at a ledge when it is still in the air', () => {
    const enemy = createEnemyIn(LEDGE_LEVEL, 45, 74, false);

    const stepped = nextEnemy(LEDGE_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(stepped.statuses.isFacingRight).toBe(true);
    expect(stepped.position.x).toBeCloseTo(
      45 + ENEMY_MOVE_SPEED * DELTA_SECONDS,
      6,
    );
  });

  it('should hop when it stands on the ground and the player is just above it', () => {
    const enemy = createEnemyIn(FLAT_LEVEL, 133, 74, true);
    const player = createPlayerAt(133, 74 + 6 - PLAYER_HEIGHT);

    const stepped = nextEnemy(FLAT_LEVEL, enemy, player, DELTA_SECONDS);

    expect(stepped.velocity.y.current).toBeCloseTo(
      -ENEMY_JUMP_VELOCITY + GRAVITY * DELTA_SECONDS,
      6,
    );
    expect(stepped.statuses.isGrounded).toBe(false);
    expect(stepped.position.y).toBeLessThan(74);
  });

  it('should finish dying when it falls two rows below the bottom of the level', () => {
    const enemy = createEnemyIn(FLAT_LEVEL, 133, 200, false);

    const stepped = nextEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(stepped.timers.death).toBe(ENEMY_DEATH_SECONDS);
    expect(stepped.velocity.x.current).toBe(0);
    expect(stepped.velocity.y.current).toBe(0);
    expect(stepped.position).toEqual({ x: 133, y: 200 });
  });

  it('should leave the given enemy unchanged when it takes a step', () => {
    const enemy = createEnemyIn(FLAT_LEVEL, 133, 74, true);

    nextEnemy(FLAT_LEVEL, enemy, FAR_PLAYER, DELTA_SECONDS);

    expect(enemy).toEqual(createEnemyIn(FLAT_LEVEL, 133, 74, true));
  });
});
