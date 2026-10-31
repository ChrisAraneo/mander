import {
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
import { constant, head, map, reduce, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from './player/consts';
import { getSpawnPosition } from './player/get-spawn-position';

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

const SURFACE = 12 * TILE_SIZE;

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

const SPAWN_X = getSpawnPosition(createTestLevel()).x;

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const createSettledState = (left: number, inventory: Item[] = []): GameState =>
  pipe(
    createInitialState(createTestLevel(), 0, inventory),
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
    const start = createInitialState(createTestLevel(), 0, []);

    expect(start.player.statuses.isGrounded).toBe(false);

    const landed = nextTicks(start, 60);

    expect(landed.player.statuses.isGrounded).toBe(true);
    expect(landed.player.position.y).toBe(SURFACE - PLAYER_HEIGHT);
    expect(landed.player.velocity.y.current).toBe(0);
  });

  it('should move the player and stop them again when right is pressed and released', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const pressed = nextGameState(
      start,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const moved = nextTicks(pressed, 10);

    expect(moved.player.position.x).toBeGreaterThan(start.player.position.x);
    expect(moved.player.statuses.isFacingRight).toBe(true);

    const movedX = moved.player.position.x;
    const released = nextGameState(
      moved,
      { type: 'MOVE_RIGHT_STOP' },
      constant(0),
    );
    const stopped = nextTicks(released, 5);

    expect(stopped.player.position.x).toBe(movedX);
  });

  it('should stop the player when a wall stands to their left', () => {
    const start = createSettledState(3 * TILE_SIZE);
    const pressed = nextGameState(
      start,
      { type: 'MOVE_LEFT_START' },
      constant(0),
    );
    const stopped = nextTicks(pressed, 600);

    expect(stopped.player.position.x).toBe(TILE_SIZE);
    expect(stopped.player.velocity.x.current).toBe(0);
    expect(stopped.player.statuses.isFacingRight).toBe(false);
  });

  it('should hold the player back when the ceiling is one tile above the ground', () => {
    const level = createTestLevel();
    level.tiles[10][6] = TILE_DIRT;
    const start = createInitialState(level, 0, []);
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: 3 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const pressed = nextGameState(
      placed,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const walked = nextTicks(pressed, 120);

    expect(walked.player.position.x + PLAYER_WIDTH).toBeLessThanOrEqual(
      6 * TILE_SIZE,
    );
  });

  it('should respawn the player, count a death and spend a heart when they fall into the pit', () => {
    const start = createSettledState(8 * TILE_SIZE);
    start.player.position.x = 10 * TILE_SIZE + 5;
    const state = nextTicks(start, 120);

    expect(state.deaths).toBe(1);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.player.hearts.value, 'the fall cost a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.status, 'with hearts to spare the run goes on').toBe(
      'PLAYING',
    );
  });

  it('should reset the player position but keep the key and inventory when the player respawns', () => {
    const start = createSettledState(15 * TILE_SIZE, [createItem('EXTRA')]);
    const collected = nextTicks(start, 2);

    expect(collected.hasKey).toBe(true);

    const respawned = nextGameState(
      collected,
      { type: 'RESPAWN' },
      constant(0),
    );

    expect(respawned.player.position.x).toBe(SPAWN_X);
    expect(respawned.hasKey).toBe(true);
    expect(respawned.inventory).toHaveLength(1);
  });
});
