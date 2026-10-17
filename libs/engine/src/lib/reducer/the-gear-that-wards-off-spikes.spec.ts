import {
  BOOTS_OF_CLOUDS,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TITANIUM_HELMET,
} from '@mander/model';
import { chain, type Point } from '@mander/utils';
import { ceil, head, map, reduce as fold, size, some, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { BASE_HEARTS, PLAYER_HEIGHT } from './player/consts';
import { reduce } from './reduce';

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

const DELTA_SECONDS = 1 / 60;

const SPIKE_COLUMN = 6;

const SPIKE_X = SPIKE_COLUMN * TILE_SIZE;

const CEILING_COLUMN = 6;

const CEILING_ROW = 9;

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

const createTestLevel = (enemies: Point[] = []): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row, rowIndex) =>
    map(row, (symbol, columnIndex) =>
      match(
        some(
          enemies,
          (spawn) => spawn.x === columnIndex && spawn.y === rowIndex,
        ),
      )
        .with(true, () => TILE_ENEMY)
        .otherwise(() => LEGEND[symbol]),
    ),
  ),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

const createSpikeLevel = (column: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (row, rowIndex) =>
        map(row, (tile, columnIndex) =>
          match(rowIndex === 11 && columnIndex === column)
            .with(true, () => TILE_SPIKE)
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const createCeilingSpikeLevel = (column: number, row: number): GameLevel =>
  chain(createTestLevel())
    .thru((level): GameLevel => ({
      ...level,
      tiles: map(level.tiles, (tiles, rowIndex) =>
        map(tiles, (tile, columnIndex) =>
          match({ isSpikeColumn: columnIndex === column, rowIndex })
            .with({ isSpikeColumn: true, rowIndex: row - 1 }, () => TILE_DIRT)
            .with(
              { isSpikeColumn: true, rowIndex: row },
              () => TILE_SPIKE_CEILING,
            )
            .otherwise(() => tile),
        ),
      ),
    }))
    .value();

const nextTick = (state: GameState): GameState =>
  reduce(state, { type: 'TICK' });

const nextTicks = (state: GameState, tickCount: number): GameState =>
  fold(times(tickCount), (current) => nextTick(current), state);

const computeTickCount = (seconds: number): number =>
  ceil(seconds / DELTA_SECONDS) + 1;

const createStateOnSpikes = (...gear: Item[]): GameState =>
  chain(createInitialState(createSpikeLevel(SPIKE_COLUMN), 0, gear))
    .thru((state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: SPIKE_X, y: SURFACE - PLAYER_HEIGHT },
      },
    }))
    .value();

const createStateUnderCeilingSpikes = (...gear: Item[]): GameState =>
  chain(
    createInitialState(
      createCeilingSpikeLevel(CEILING_COLUMN, CEILING_ROW),
      0,
      gear,
    ),
  )
    .thru((state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: CEILING_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    }))
    .value();

const nextJumpIntoCeiling = (state: GameState): GameState =>
  nextTicks(reduce(nextTick(state), { type: 'JUMP_START' }), 20);

describe('the gear that wards off spikes', () => {
  it('should walk the player over the floor spikes when they wear the Boots of Clouds', () => {
    const state = nextTicks(
      createStateOnSpikes(BOOTS_OF_CLOUDS),
      computeTickCount(1),
    );

    expect(state.player.hearts.value, 'not a scratch').toBe(BASE_HEARTS);
    expect(state.player.timers.death, 'and still on their feet').toBeNull();
    expect(state.deaths).toBe(0);
  });

  it('should let the floor spikes bite when the player has no boots', () => {
    const state = nextTick(createStateOnSpikes());

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should shrug the ceiling spikes off when the player wears the Titanium Helmet', () => {
    const state = nextJumpIntoCeiling(
      createStateUnderCeilingSpikes(TITANIUM_HELMET),
    );

    expect(state.player.hearts.value, 'the prongs glance off').toBe(
      BASE_HEARTS,
    );
    expect(state.deaths).toBe(0);
  });

  it('should let the ceiling spikes bite when the player has no helmet', () => {
    const state = nextJumpIntoCeiling(createStateUnderCeilingSpikes());

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should let the ceiling spikes bite when the player wears only the boots', () => {
    const state = nextJumpIntoCeiling(
      createStateUnderCeilingSpikes(BOOTS_OF_CLOUDS),
    );

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should let the floor spikes bite when the player wears only the helmet', () => {
    const state = nextTick(createStateOnSpikes(TITANIUM_HELMET));

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should keep the gear on when the next level loads', () => {
    const state = reduce(createStateOnSpikes(BOOTS_OF_CLOUDS), {
      type: 'LOAD_LEVEL',
      level: createSpikeLevel(SPIKE_COLUMN),
      levelIndex: 1,
    });

    expect(
      nextTicks(
        {
          ...state,
          player: {
            ...state.player,
            position: { x: SPIKE_X, y: SURFACE - PLAYER_HEIGHT },
          },
        },
        computeTickCount(1),
      ).player.hearts.value,
      'the boots came along',
    ).toBe(BASE_HEARTS);
  });

  it('should still cost a heart when an enemy touches a player in full gear', () => {
    const state = createInitialState(createTestLevel([{ x: 5, y: 11 }]), 0, [
      BOOTS_OF_CLOUDS,
      TITANIUM_HELMET,
    ]);
    const settled = nextTicks(
      {
        ...state,
        player: {
          ...state.player,
          position: {
            x: state.enemies[0].position.x,
            y: SURFACE - PLAYER_HEIGHT,
          },
        },
      },
      2,
    );

    expect(settled.player.hearts.value).toBeLessThan(BASE_HEARTS);
  });
});
