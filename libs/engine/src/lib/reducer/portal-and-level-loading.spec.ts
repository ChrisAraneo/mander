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
import { constant, head, map, omit, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT } from './player/consts';
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

const computeSimulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

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
});

const SPAWN_X = getSpawnPosition(createTestLevel()).x;

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

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

describe('portal and level loading', () => {
  it('should complete the level when the player enters the portal without the key', () => {
    const start = createSettledState(25 * TILE_SIZE - 10);

    expect(start.isNearPortal).toBe(true);

    const completed = nextGameState(start, { type: 'INTERACT' }, constant(0));

    expect(completed.status).toBe('COMPLETE');
    expect(computeSimulation(nextTick(completed))).toEqual(
      computeSimulation(completed),
    );
  });

  it('should wind the clock back but keep the inventory when the next level loads', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));
    const chosen = nextGameState(
      opened,
      { type: 'CHOOSE_ITEM', index: 3 },
      constant(0),
    );
    const carried = chosen.time;
    const loaded = nextGameState(
      chosen,
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(loaded.levelIndex).toBe(1);
    expect(loaded.status).toBe('PLAYING');
    expect(loaded.hasKey).toBe(false);
    expect(loaded.isChestOpened).toBe(false);
    expect(carried, 'the first level put time on the clock').toBeGreaterThan(0);
    expect(loaded.time, 'which the next level winds back').toBe(0);
    expect(loaded.player.position.x).toBe(SPAWN_X);
    expect(map(loaded.inventory, (item) => item.id)).toEqual(['CARD-3']);
  });
});
