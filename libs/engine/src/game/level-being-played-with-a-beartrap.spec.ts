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

import { ENEMY_WIDTH, HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { createEnemies } from '../enemy/create-enemies';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { BASE_HEARTS, PLAYER_WIDTH } from '../player/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

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

const SPAWN_ROW = FLOOR_ROW - 1;

const DROP_ROW = FLOOR_ROW - 5;

const NEXT_COLUMN = TRAP_COLUMN + 1;

const FAR_COLUMN = TRAP_COLUMN + 8;

const LEFT_COLUMN = 1;

const RIGHT_COLUMN = WIDTH - 2;

const SETTLE_TICKS = 90;

const PATROL_TICKS = 300;

const DIVE_TICKS = 120;

const TRAP_JUMP_TICKS = 240;

const ONE_HEART = 1;

const ONE_TRAP = 1;

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
  row: number,
  column: number,
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

const createSpawnLevel = (row: number, column: number): GameLevel =>
  patchSpawnTile(createArena(), row, column);

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const createPlayedState = (level: GameLevel, tickCount: number): GameState =>
  nextTicks(createInitialState(level, FIRST_LEVEL_INDEX, []), tickCount);

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
      createSpawnLevel(DROP_ROW, TRAP_COLUMN),
      SETTLE_TICKS,
    );

    expect(bitten.player.hearts.value).toBe(BASE_HEARTS - ONE_HEART);
  });

  it('should survive when the player drops onto it', () => {
    const jumped = createPlayedState(
      createSpawnLevel(DROP_ROW, TRAP_COLUMN),
      SETTLE_TICKS,
    );

    expect(size(jumped.enemies)).toBe(ONE_TRAP);
    expect(jumped.enemies[0].kind).toBe('BEARTRAP');
    expect(jumped.enemies[0].timers.death).toBeNull();
  });

  it('should turn the walking enemy back when it is about to step into the trap', () => {
    const level = createSpawnLevel(SPAWN_ROW, RIGHT_COLUMN);
    level.tiles[TRAP_ROW][TRAP_COLUMN - 3] = TILE_ENEMY;

    const patrolled = createPlayedState(level, PATROL_TICKS);
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
    const level = createSpawnLevel(SPAWN_ROW, NEXT_COLUMN);
    level.tiles[TRAP_ROW - 3][TRAP_COLUMN] = TILE_ENEMY;

    const cleared = createPlayedState(level, DIVE_TICKS);

    expect(size(cleared.enemies)).toBe(1);
    expect(cleared.enemies[0].kind).toBe('BEARTRAP');
  });

  it('should leave the player alone when they stay across the room', () => {
    const safe = createPlayedState(
      createSpawnLevel(SPAWN_ROW, FAR_COLUMN),
      SETTLE_TICKS,
    );

    expect(safe.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should spring at the player when they try to jump clean over it', () => {
    const level = createSpawnLevel(SPAWN_ROW, LEFT_COLUMN);
    const start: TrapJump = {
      state: nextGameState(
        createInitialState(level, FIRST_LEVEL_INDEX, []),
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
      times(TRAP_JUMP_TICKS),
      (current) => nextTrapJump(current),
      start,
    );

    expect(trapJump.hasLeftTheGround, 'the player really jumped').toBe(true);
    expect(trapJump.hasSprung, 'the trap went off').toBe(true);
    expect(trapJump.state.player.hearts.value, 'and caught them').toBe(
      BASE_HEARTS - ONE_HEART,
    );
  });

  it('should be laid again when the player respawns', () => {
    const level = createSpawnLevel(SPAWN_ROW, NEXT_COLUMN);
    const respawned = nextGameState(
      createPlayedState(level, SETTLE_TICKS),
      {
        type: 'RESPAWN',
      },
      constant(0),
    );

    expect(respawned.enemies).toEqual(createEnemies(level));
  });
});
