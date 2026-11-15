import {
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../start/create-initial-state';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { FIRST_LEVEL_INDEX } from './consts';
import { handleLoadLevel } from './handle-load-level';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const createLevel = (seed: string, rows: string[]): GameLevel => ({
  seed,
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const OLD_LEVEL = createLevel('OLD', ['.....', '.S...', '#####']);

const NEW_LEVEL = createLevel('NEW', [
  '.......',
  '.......',
  '....S..',
  '#######',
]);

const NEXT_LEVEL_INDEX = 1;

const NEW_LEVEL_SPAWN = { x: 133, y: 16 };

const CARRIED_SCORE = 9000;

const CARRIED_DEATHS = 2;

const CARRIED_HEARTS = 3;

const createFinishedState = (): GameState => ({
  ...createInitialState(OLD_LEVEL, FIRST_LEVEL_INDEX, [STAR]),
  player: {
    ...createInitialState(OLD_LEVEL, FIRST_LEVEL_INDEX, [STAR]).player,
    position: { x: 120, y: 40 },
    hearts: { value: CARRIED_HEARTS },
  },
  bullets: [
    { position: { x: 10, y: 20 }, velocity: { x: { current: 5, max: 5 } } },
  ],
  cannonballs: [
    {
      position: { x: 30, y: 40 },
      velocity: { x: { current: -2, max: 2 }, y: { current: 0, max: 2 } },
    },
  ],
  status: 'COMPLETE',
  hasKey: true,
  isChestOpened: true,
  isNearChest: true,
  isNearPortal: true,
  time: 33,
  levelTimes: [33],
  deaths: 2,
  score: 9000,
});

describe('handleLoadLevel', () => {
  it('should swap in the new level and its number when the next level is loaded', () => {
    const loaded = handleLoadLevel(
      createFinishedState(),
      NEW_LEVEL,
      NEXT_LEVEL_INDEX,
    );

    expect(loaded.level).toBe(NEW_LEVEL);
    expect(loaded.levelIndex).toBe(NEXT_LEVEL_INDEX);
  });

  it('should start the new level afresh when the next level is loaded', () => {
    const loaded = handleLoadLevel(
      createFinishedState(),
      NEW_LEVEL,
      NEXT_LEVEL_INDEX,
    );

    expect(loaded.status).toBe('PLAYING');
    expect(loaded.time).toBe(0);
    expect(loaded.hasKey).toBe(false);
    expect(loaded.isChestOpened).toBe(false);
    expect(loaded.isNearChest).toBe(false);
    expect(loaded.isNearPortal).toBe(false);
  });

  it('should clear every bullet and cannonball in flight when the next level is loaded', () => {
    const loaded = handleLoadLevel(
      createFinishedState(),
      NEW_LEVEL,
      NEXT_LEVEL_INDEX,
    );

    expect(loaded.bullets).toEqual([]);
    expect(loaded.cannonballs).toEqual([]);
  });

  it('should keep the inventory, score, deaths and level times when the next level is loaded', () => {
    const state = createFinishedState();

    const loaded = handleLoadLevel(state, NEW_LEVEL, NEXT_LEVEL_INDEX);

    expect(loaded.inventory).toBe(state.inventory);
    expect(loaded.score).toBe(CARRIED_SCORE);
    expect(loaded.deaths).toBe(CARRIED_DEATHS);
    expect(loaded.levelTimes).toBe(state.levelTimes);
  });

  it('should place the player at the spawn of the new level when the next level is loaded', () => {
    const loaded = handleLoadLevel(
      createFinishedState(),
      NEW_LEVEL,
      NEXT_LEVEL_INDEX,
    );

    expect(loaded.player.position).toEqual(NEW_LEVEL_SPAWN);
  });

  it('should keep the hearts the player had when the next level is loaded', () => {
    const loaded = handleLoadLevel(
      createFinishedState(),
      NEW_LEVEL,
      NEXT_LEVEL_INDEX,
    );

    expect(loaded.player.hearts).toEqual({ value: CARRIED_HEARTS });
  });

  it('should leave the game it was handed untouched when the next level is loaded', () => {
    const state = createFinishedState();

    handleLoadLevel(state, NEW_LEVEL, NEXT_LEVEL_INDEX);

    expect(state).toEqual(createFinishedState());
  });
});
