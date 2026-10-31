import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { constant, find, map, reduce, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { ENEMY_WIDTH, HORNED_ENEMY_CHANCE } from './enemy/consts';
import { createEnemies } from './enemy/create-enemies';
import { nextGameState } from './next-game-state';
import { BASE_HEARTS, PLAYER_WIDTH } from './player/consts';

interface TrapJump {
  state: GameState;
  hasSettled: boolean;
  hasSprung: boolean;
  hasLeftTheGround: boolean;
}

const WIDTH = 20;

const HEIGHT = 14;

const FLOOR_ROW = 12;

const TRAP_ROW = FLOOR_ROW - 1;

const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const TRAP_CENTRE_X = TRAP_X + ENEMY_WIDTH / 2;

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const patchSpawnTile = (
  level: GameLevel,
  column: number,
  row: number,
): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (tiles, rowIndex) =>
    map(tiles, (tile, columnIndex) =>
      match(rowIndex === row && columnIndex === column)
        .with(true, () => TILE_SPAWN)
        .otherwise(() => tile),
    ),
  ),
});

const createSpawnLevel = (column: number, row: number): GameLevel =>
  patchSpawnTile(createArena(), column, row);

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const createPlayedState = (level: GameLevel, tickCount: number): GameState =>
  nextTicks(createInitialState(level, 0, []), tickCount);

const computeTrapGap = (state: GameState): number =>
  TRAP_CENTRE_X - (state.player.position.x + PLAYER_WIDTH / 2);

const nextJumpNearTrap = (state: GameState): GameState =>
  match(
    computeTrapGap(state) <= TILE_SIZE * 3 && state.player.statuses.isGrounded,
  )
    .with(true, () => nextGameState(state, { type: 'JUMP_START' }, constant(0)))
    .otherwise(() => state);

const nextTrapJump = (trapJump: TrapJump): TrapJump =>
  pipe(
    trapJump.state,
    nextJumpNearTrap,
    nextTick,
    (state) => ({
      state,
      isTrapGrounded: state.enemies[0].statuses.isGrounded,
    }),
    ({ state, isTrapGrounded }): TrapJump => ({
      state,
      hasSettled: trapJump.hasSettled || isTrapGrounded,
      hasSprung: trapJump.hasSprung || (!isTrapGrounded && trapJump.hasSettled),
      hasLeftTheGround:
        trapJump.hasLeftTheGround || !state.player.statuses.isGrounded,
    }),
  );

describe('a level being played', () => {
  it('should cost the player a heart when it snaps shut on them', () => {
    const bitten = createPlayedState(
      createSpawnLevel(TRAP_COLUMN, FLOOR_ROW - 5),
      90,
    );

    expect(bitten.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should survive when the player drops onto it', () => {
    const jumped = createPlayedState(
      createSpawnLevel(TRAP_COLUMN, FLOOR_ROW - 5),
      90,
    );

    expect(size(jumped.enemies)).toBe(1);
    expect(jumped.enemies[0].kind).toBe('BEARTRAP');
    expect(jumped.enemies[0].timers.death).toBeNull();
  });

  it('should turn the walking enemy back when it is about to step into the trap', () => {
    const level = createSpawnLevel(WIDTH - 2, FLOOR_ROW - 1);
    level.tiles[TRAP_ROW][TRAP_COLUMN - 3] = TILE_ENEMY;

    const patrolled = createPlayedState(level, 300);
    const walker = find(
      patrolled.enemies,
      (enemy) => enemy.kind !== 'BEARTRAP',
    );

    expect(walker, 'the enemy is still on its feet').toBeDefined();
    expect(walker?.timers.death).toBeNull();
    expect((walker?.position.x ?? NaN) + ENEMY_WIDTH).toBeLessThanOrEqual(
      TRAP_X,
    );
  });

  it('should kill the flying enemy when its leap carries it into one', () => {
    const level = createSpawnLevel(TRAP_COLUMN + 1, FLOOR_ROW - 1);
    level.tiles[TRAP_ROW - 3][TRAP_COLUMN] = TILE_ENEMY;

    const cleared = createPlayedState(level, 120);

    expect(size(cleared.enemies)).toBe(1);
    expect(cleared.enemies[0].kind).toBe('BEARTRAP');
  });

  it('should leave the player alone when they stay across the room', () => {
    const safe = createPlayedState(
      createSpawnLevel(TRAP_COLUMN + 8, FLOOR_ROW - 1),
      90,
    );

    expect(safe.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should spring at the player when they try to jump clean over it', () => {
    const level = createSpawnLevel(1, FLOOR_ROW - 1);
    const start: TrapJump = {
      state: nextGameState(
        createInitialState(level, 0, []),
        {
          type: 'MOVE_RIGHT_START',
        },
        constant(0),
      ),
      hasSettled: false,
      hasSprung: false,
      hasLeftTheGround: false,
    };
    const trapJump = reduce(
      times(240),
      (current) => nextTrapJump(current),
      start,
    );

    expect(trapJump.hasLeftTheGround, 'the player really jumped').toBe(true);
    expect(trapJump.hasSprung, 'the trap went off').toBe(true);
    expect(trapJump.state.player.hearts.value, 'and caught them').toBe(
      BASE_HEARTS - 1,
    );
  });

  it('should be laid again when the player respawns', () => {
    const level = createSpawnLevel(TRAP_COLUMN + 1, FLOOR_ROW - 1);
    const respawned = nextGameState(
      createPlayedState(level, 90),
      {
        type: 'RESPAWN',
      },
      constant(0),
    );

    expect(respawned.enemies).toEqual(createEnemies(level));
  });
});
