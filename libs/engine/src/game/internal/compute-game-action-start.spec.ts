import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { computeGameActionStart } from './compute-game-action-start';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const START_TIME = 1500;

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState =>
  createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

const createClock = () => () => START_TIME;

describe('computeGameActionStart', () => {
  it('should read the time off the clock when the action begins', () => {
    const started = computeGameActionStart({
      state: createState(),
      action: { type: 'TICK' },
      now: createClock(),
    });

    expect(started.startTime).toBe(START_TIME);
  });

  it('should pass the game on when the action begins', () => {
    const state = createState();

    const started = computeGameActionStart({
      state,
      action: { type: 'TICK' },
      now: createClock(),
    });

    expect(started.state).toBe(state);
  });

  it('should pass the action on when the action begins', () => {
    const started = computeGameActionStart({
      state: createState(),
      action: { type: 'JUMP_START' },
      now: createClock(),
    });

    expect(started.action).toEqual({ type: 'JUMP_START' });
  });

  it('should pass the clock on when the action begins', () => {
    const now = createClock();

    const started = computeGameActionStart({
      state: createState(),
      action: { type: 'TICK' },
      now,
    });

    expect(started.now).toBe(now);
  });

  it('should leave the game it was handed untouched when the action begins', () => {
    const state = createState();
    const before = structuredClone(state);

    computeGameActionStart({
      state,
      action: { type: 'TICK' },
      now: createClock(),
    });

    expect(state).toEqual(before);
  });
});
