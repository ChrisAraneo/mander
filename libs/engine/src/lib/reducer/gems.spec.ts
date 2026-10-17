import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { chain } from '@mander/utils';
import { head, includes, map, reduce as fold, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './player/consts';
import { reduce } from './reduce';
import { GEM_SCORE } from './score/consts';

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

const GEM_ROW = SURFACE / TILE_SIZE - 2;

const LEFT_COLUMN = 5;

const RIGHT_COLUMN = 8;

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
});

const nextTick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK' });

const nextTicks = (state: GameState, tickCount: number): GameState =>
  fold(times(tickCount), (current) => nextTick(current), state);

const createGemLevel = (columns: number[]): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (row, rowIndex) =>
        map(row, (tile, columnIndex) =>
          match(rowIndex === GEM_ROW && includes(columns, columnIndex))
            .with(true, () => TILE_GEM)
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const createStateAtColumn = (level: GameLevel, column: number): GameState =>
  chain(createInitialState(level, 0, []))
    .thru((state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: {
          x: column * TILE_SIZE + (TILE_SIZE - PLAYER_WIDTH) / 2,
          y: SURFACE - PLAYER_HEIGHT,
        },
      },
    }))
    .value();

describe('gems', () => {
  it('should set out every gem when the level was strewn with them', () => {
    const state = createInitialState(
      createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]),
      0,
      [],
    );

    expect(state.gems).toEqual([
      { x: LEFT_COLUMN, y: GEM_ROW },
      { x: RIGHT_COLUMN, y: GEM_ROW },
    ]);
  });

  it('should pay five hundred when the player walks into a gem', () => {
    const state = nextTick(
      createStateAtColumn(
        createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]),
        LEFT_COLUMN,
      ),
    );

    expect(state.score).toBe(GEM_SCORE);
    expect(state.gems, 'and takes it off the ground').toEqual([
      { x: RIGHT_COLUMN, y: GEM_ROW },
    ]);
  });

  it('should pay for the gem once when the player loiters over it', () => {
    const state = nextTicks(
      createStateAtColumn(
        createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]),
        LEFT_COLUMN,
      ),
      120,
    );

    expect(state.score).toBe(GEM_SCORE);
  });

  it('should collect the gems one after another when the player runs the level', () => {
    const pressed = reduce(
      createStateAtColumn(createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]), 3),
      { type: 'MOVE_RIGHT_START' },
    );
    const ran = nextTicks(pressed, 240);

    expect(ran.score).toBe(GEM_SCORE * 2);
    expect(ran.gems).toEqual([]);
  });

  it('should leave the gem where it lies when the player never comes near it', () => {
    const state = nextTicks(
      createStateAtColumn(createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]), 3),
      120,
    );

    expect(state.score).toBe(0);
    expect(state.gems).toHaveLength(2);
  });

  it('should keep the gems already pocketed when the player dies', () => {
    const pocketed = nextTick(
      createStateAtColumn(
        createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]),
        LEFT_COLUMN,
      ),
    );
    const respawned = reduce(pocketed, { type: 'RESPAWN' });

    expect(respawned.gems).toHaveLength(1);
    expect(respawned.score).toBe(GEM_SCORE);
  });

  it('should strew the next level afresh and keep what the last one paid when it loads', () => {
    const pocketed = nextTick(
      createStateAtColumn(
        createGemLevel([LEFT_COLUMN, RIGHT_COLUMN]),
        LEFT_COLUMN,
      ),
    );
    const loaded = reduce(pocketed, {
      type: 'LOAD_LEVEL',
      level: createGemLevel([LEFT_COLUMN]),
      levelIndex: 1,
    });

    expect(loaded.gems).toEqual([{ x: LEFT_COLUMN, y: GEM_ROW }]);
    expect(loaded.score).toBe(GEM_SCORE);
  });

  it('should pocket no gem when the player is dead', () => {
    const level = createGemLevel([LEFT_COLUMN]);
    const start = createStateAtColumn(level, LEFT_COLUMN);
    const dead = {
      ...start,
      player: { ...start.player, timers: { ...start.player.timers, death: 0 } },
    };
    const ticked = nextTick(dead);

    expect(ticked.gems).toHaveLength(1);
    expect(ticked.score).toBe(0);
  });
});
