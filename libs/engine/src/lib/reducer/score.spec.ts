import {
  type Item,
  RED_GEM,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT } from './player/consts';
import { computeTotalTime } from './score/compute-total-time';
import {
  LEVEL_SCORE_BASE,
  LEVEL_SCORE_MIN,
  LEVEL_SCORE_PER_SECOND,
} from './score/consts';

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
});

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

const createPortalState = (seconds: number): GameState => ({
  ...createSettledState(25 * TILE_SIZE - 10),
  time: seconds,
});

const nextPortalEntry = (state: GameState): GameState =>
  nextGameState(state, { type: 'INTERACT' }, constant(0));

const computeLevelScore = (seconds: number): number =>
  LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * seconds;

describe('score', () => {
  it('should have nothing scored when a run starts', () => {
    expect(createInitialState(createTestLevel(), 0, []).score).toBe(0);
  });

  it('should pay the base rate less a hundred for every second when the level is finished', () => {
    expect(nextPortalEntry(createPortalState(0)).score).toBe(LEVEL_SCORE_BASE);
    expect(nextPortalEntry(createPortalState(12)).score).toBe(
      computeLevelScore(12),
    );
  });

  it('should charge whole seconds only when the clock stops part-way through one', () => {
    expect(nextPortalEntry(createPortalState(12.4)).score, 'rounds down').toBe(
      computeLevelScore(12),
    );
    expect(nextPortalEntry(createPortalState(12.6)).score, 'rounds up').toBe(
      computeLevelScore(13),
    );
  });

  it('should still pay a hundred when the level took all day', () => {
    const floorSeconds =
      (LEVEL_SCORE_BASE - LEVEL_SCORE_MIN) / LEVEL_SCORE_PER_SECOND;

    expect(nextPortalEntry(createPortalState(900)).score).toBe(LEVEL_SCORE_MIN);
    expect(
      nextPortalEntry(createPortalState(floorSeconds)).score,
      'the last second it pays more',
    ).toBe(LEVEL_SCORE_MIN);
    expect(nextPortalEntry(createPortalState(floorSeconds - 1)).score).toBe(
      LEVEL_SCORE_MIN + LEVEL_SCORE_PER_SECOND,
    );
  });

  it('should bill each level against its own clock when the score adds up over a run', () => {
    const finished = nextPortalEntry(createPortalState(10));

    expect(finished.score, 'the first level, taken in ten seconds').toBe(
      computeLevelScore(10),
    );

    const loaded = nextGameState(
      finished,
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );
    const finishedAgain = nextPortalEntry({
      ...loaded,
      time: 30,
      isNearPortal: true,
    });

    expect(
      finishedAgain.score,
      'the second is billed against its own thirty seconds',
    ).toBe(computeLevelScore(10) + computeLevelScore(30));
  });

  it('should keep the seconds each level took when the run moves on', () => {
    const finished = nextPortalEntry(createPortalState(10));
    const loaded = nextGameState(
      finished,
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );
    const finishedAgain = nextPortalEntry({
      ...loaded,
      time: 30,
      isNearPortal: true,
    });

    expect(finishedAgain.levelTimes).toEqual([10, 30]);
    expect(computeTotalTime(finishedAgain.levelTimes)).toBe(40);
  });

  it('should pay out on the spot when the player takes a red gem', () => {
    const start: GameState = {
      ...createInitialState(createTestLevel(), 0, []),
      status: 'CHEST',
    };
    const stocked = {
      ...start,
      level: { ...start.level, chestItems: [RED_GEM] },
    };
    const chosen = nextGameState(
      stocked,
      { type: 'CHOOSE_ITEM', index: 0 },
      constant(0),
    );

    expect(chosen.score).toBe(1500);
  });
});
