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
import { constant, head, map, omit, reduce, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT } from './player/consts';

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
  shooterEnemyChance: 0,
});

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

describe('key and chest', () => {
  it('should collect the key when the player walks over it', () => {
    const start = createSettledState(13 * TILE_SIZE);

    expect(start.hasKey).toBe(false);

    const pressed = nextGameState(
      start,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const walked = nextTicks(pressed, 120);

    expect(walked.hasKey).toBe(true);
  });

  it('should keep the chest locked when the player has no key', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);

    expect(start.isNearChest).toBe(true);
    expect(start.hasKey).toBe(false);

    const interacted = nextGameState(start, { type: 'INTERACT' }, constant(0));

    expect(interacted.status).toBe('PLAYING');
    expect(interacted.inventory).toHaveLength(0);
  });

  it('should open the chest and take one card when the player has the key', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));

    expect(opened.status).toBe('CHEST');

    const pressed = nextGameState(
      opened,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const frozen = nextTick(pressed);

    expect(frozen.player).toEqual(pressed.player);
    expect(frozen.input.isRight).toBe(true);

    const released = nextGameState(
      pressed,
      { type: 'MOVE_RIGHT_STOP' },
      constant(0),
    );
    const chosen = nextGameState(
      released,
      { type: 'CHOOSE_ITEM', index: 1 },
      constant(0),
    );

    expect(chosen.status).toBe('PLAYING');
    expect(chosen.isChestOpened).toBe(true);
    expect(map(chosen.inventory, (item) => item.id)).toEqual(['CARD-1']);

    const ticked = nextTick(chosen);

    expect(ticked.isNearChest).toBe(false);

    const again = nextGameState(ticked, { type: 'INTERACT' }, constant(0));

    expect(again.status).toBe('PLAYING');
    expect(again.inventory).toHaveLength(1);
  });

  it('should leave the chest alone when the player interacts with it already open', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));

    expect(opened.status).toBe('CHEST');

    const again = nextGameState(opened, { type: 'INTERACT' }, constant(0));

    expect(again.status).toBe('CHEST');
    expect(again.isChestOpened).toBe(false);
    expect(again.inventory).toHaveLength(0);
  });

  it('should take only the card the player named when several are offered', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));

    const chosen = nextGameState(
      opened,
      { type: 'CHOOSE_ITEM', index: 2 },
      constant(0),
    );

    expect(chosen.status).toBe('PLAYING');
    expect(map(chosen.inventory, (item) => item.id)).toEqual(['CARD-2']);
  });

  it('should leave the chest unopened when the player closes it', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));
    const closed = nextGameState(opened, { type: 'CLOSE' }, constant(0));

    expect(closed.status).toBe('PLAYING');
    expect(closed.isChestOpened).toBe(false);
    expect(closed.inventory).toHaveLength(0);

    const ticked = nextTick(closed);

    expect(ticked.isNearChest).toBe(true);
  });

  it('should ignore the choice when the index is not one of the cards', () => {
    const start = createSettledState(20 * TILE_SIZE - 20);
    const keyed = { ...start, hasKey: true };
    const opened = nextGameState(keyed, { type: 'INTERACT' }, constant(0));

    const unchanged = nextGameState(
      opened,
      { type: 'CHOOSE_ITEM', index: 99 },
      constant(0),
    );

    expect(computeSimulation(unchanged)).toEqual(computeSimulation(opened));
  });
});
