import {
  FIXED_STEP_SECONDS,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { ceil, constant, head, map, reduce, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { HORNED_ENEMY_CHANCE } from '../enemy/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { computeSpawnPosition } from '../player/compute-spawn-position';
import {
  ACCELERATION_SECONDS,
  BASE_HEARTS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '../player/consts';
import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
};

const ROWS = [
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#.S......................P...#',
  '#.S............K....C....P...#',
  '##########..##################',
  '##########..##################',
  '##########..##################',
];

const FLOOR_ROW = 12;

const SURFACE = FLOOR_ROW * TILE_SIZE;

const START_COLUMN = 3;

const START_X = START_COLUMN * TILE_SIZE;

const PIT_APPROACH_COLUMN = 8;

const PIT_COLUMN = 10;

const PIT_NUDGE = 5;

const KEY_APPROACH_COLUMN = 15;

const CEILING_ROW = 10;

const CEILING_COLUMN = 6;

const LANDING_TICKS = 60;

const NUDGE_TICKS = 10;

const WALK_TICKS = 120;

const LONG_WALK_TICKS = 600;

const COLLECT_TICKS = 2;

const ONE_HEART = 1;

const ONE_DEATH = 1;

const ONE_ITEM = 1;

const createItem = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  createItem('CARD-0'),
  createItem('CARD-1'),
  createItem('CARD-2'),
  createItem('CARD-3'),
  createItem('CARD-4'),
];

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const SPAWN_X = computeSpawnPosition(createTestLevel()).x;

const STOP_TICKS = ceil(ACCELERATION_SECONDS / FIXED_STEP_SECONDS);

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const createSettledState = (left: number, inventory: Item[] = []): GameState =>
  pipe(
    createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, inventory),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
    (state) => nextTick(state),
  );

describe('movement actions', () => {
  it('should apply gravity when the player is off the ground', () => {
    const start = createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);

    expect(start.player.statuses.isGrounded).toBe(false);

    const landed = nextTicks(start, LANDING_TICKS);

    expect(landed.player.statuses.isGrounded).toBe(true);
    expect(landed.player.position.y).toBe(SURFACE - PLAYER_HEIGHT);
    expect(landed.player.velocity.y.current).toBe(0);
  });

  it('should move the player and roll them to a stop when right is pressed and released', () => {
    const start = createSettledState(START_X);
    const pressed = nextGameState(
      start,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const moved = nextTicks(pressed, NUDGE_TICKS);

    expect(moved.player.position.x).toBeGreaterThan(start.player.position.x);
    expect(moved.player.statuses.isFacingRight).toBe(true);

    const movedX = moved.player.position.x;
    const released = nextGameState(
      moved,
      { type: 'MOVE_RIGHT_STOP' },
      constant(0),
    );
    const stopped = nextTicks(released, STOP_TICKS);

    expect(stopped.player.velocity.x.current).toBe(0);
    expect(stopped.player.position.x).toBeGreaterThan(movedX);
    expect(nextTicks(stopped, STOP_TICKS).player.position.x).toBe(
      stopped.player.position.x,
    );
  });

  it('should stop the player when a wall stands to their left', () => {
    const start = createSettledState(START_X);
    const pressed = nextGameState(
      start,
      { type: 'MOVE_LEFT_START' },
      constant(0),
    );
    const stopped = nextTicks(pressed, LONG_WALK_TICKS);

    expect(stopped.player.position.x).toBe(TILE_SIZE);
    expect(stopped.player.velocity.x.current).toBe(0);
    expect(stopped.player.statuses.isFacingRight).toBe(false);
  });

  it('should hold the player back when the ceiling is one tile above the ground', () => {
    const level = createTestLevel();
    level.tiles[CEILING_ROW][CEILING_COLUMN] = TILE_DIRT;
    const start = createInitialState(level, FIRST_LEVEL_INDEX, []);
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: START_X, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const pressed = nextGameState(
      placed,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const walked = nextTicks(pressed, WALK_TICKS);

    expect(walked.player.position.x + PLAYER_WIDTH).toBeLessThanOrEqual(
      CEILING_COLUMN * TILE_SIZE,
    );
  });

  it('should respawn the player, count a death and spend a heart when they fall into the pit', () => {
    const start = createSettledState(PIT_APPROACH_COLUMN * TILE_SIZE);
    start.player.position.x = PIT_COLUMN * TILE_SIZE + PIT_NUDGE;
    const state = nextTicks(start, WALK_TICKS);

    expect(state.deaths).toBe(ONE_DEATH);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.player.hearts.value, 'the fall cost a heart').toBe(
      BASE_HEARTS - ONE_HEART,
    );
    expect(state.status, 'with hearts to spare the run goes on').toBe(
      'PLAYING',
    );
  });

  it('should reset the player position but keep the key and inventory when the player respawns', () => {
    const start = createSettledState(KEY_APPROACH_COLUMN * TILE_SIZE, [
      createItem('EXTRA'),
    ]);
    const collected = nextTicks(start, COLLECT_TICKS);

    expect(collected.hasKey).toBe(true);

    const respawned = nextGameState(
      collected,
      { type: 'RESPAWN' },
      constant(0),
    );

    expect(respawned.player.position.x).toBe(SPAWN_X);
    expect(respawned.hasKey).toBe(true);
    expect(respawned.inventory).toHaveLength(ONE_ITEM);
  });
});
