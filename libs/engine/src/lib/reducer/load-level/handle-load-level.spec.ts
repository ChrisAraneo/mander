import {
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
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
  shooterEnemyChance: 0,
});

const OLD_LEVEL = createLevel('OLD', ['.....', '.S...', '#####']);

const NEW_LEVEL = createLevel('NEW', [
  '.......',
  '.......',
  '....S..',
  '#######',
]);

const createFinishedState = (): GameState => ({
  ...createInitialState(OLD_LEVEL, 0, [STAR]),
  player: {
    ...createInitialState(OLD_LEVEL, 0, [STAR]).player,
    position: { x: 120, y: 40 },
    hearts: { value: 3 },
  },
  bullets: [
    { position: { x: 10, y: 20 }, velocity: { x: { current: 5, max: 5 } } },
  ],
  cannonballs: [
    { position: { x: 30, y: 40 }, velocity: { x: { current: -2, max: 2 } } },
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
    const loaded = handleLoadLevel(createFinishedState(), NEW_LEVEL, 1);

    expect(loaded.level).toBe(NEW_LEVEL);
    expect(loaded.levelIndex).toBe(1);
  });

  it('should start the new level afresh when the next level is loaded', () => {
    const loaded = handleLoadLevel(createFinishedState(), NEW_LEVEL, 1);

    expect(loaded.status).toBe('PLAYING');
    expect(loaded.time).toBe(0);
    expect(loaded.hasKey).toBe(false);
    expect(loaded.isChestOpened).toBe(false);
    expect(loaded.isNearChest).toBe(false);
    expect(loaded.isNearPortal).toBe(false);
  });

  it('should clear every bullet and cannonball in flight when the next level is loaded', () => {
    const loaded = handleLoadLevel(createFinishedState(), NEW_LEVEL, 1);

    expect(loaded.bullets).toEqual([]);
    expect(loaded.cannonballs).toEqual([]);
  });

  it('should keep the inventory, score, deaths and level times when the next level is loaded', () => {
    const state = createFinishedState();

    const loaded = handleLoadLevel(state, NEW_LEVEL, 1);

    expect(loaded.inventory).toBe(state.inventory);
    expect(loaded.score).toBe(9000);
    expect(loaded.deaths).toBe(2);
    expect(loaded.levelTimes).toBe(state.levelTimes);
  });

  it('should place the player at the spawn of the new level when the next level is loaded', () => {
    const loaded = handleLoadLevel(createFinishedState(), NEW_LEVEL, 1);

    expect(loaded.player.position).toEqual({ x: 133, y: 16 });
  });

  it('should keep the hearts the player had when the next level is loaded', () => {
    const loaded = handleLoadLevel(createFinishedState(), NEW_LEVEL, 1);

    expect(loaded.player.hearts).toEqual({ value: 3 });
  });

  it('should leave the given state unchanged when the next level is loaded', () => {
    const state = createFinishedState();

    handleLoadLevel(state, NEW_LEVEL, 1);

    expect(state).toEqual(createFinishedState());
  });
});
