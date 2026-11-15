import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchGameActionTime } from './patch-game-action-time';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const START_TIME = 1000;

const END_TIME = 1007;

const SPENT_TIME = END_TIME - START_TIME;

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

describe('patchGameActionTime', () => {
  it('should record how long the action took when it is done', () => {
    const patched = patchGameActionTime({
      now: () => END_TIME,
      startTime: START_TIME,
      nextState: createState(),
    });

    expect(patched.updateTime).toBe(SPENT_TIME);
  });

  it('should keep everything else the action left behind when it is done', () => {
    const nextState = createState();

    const patched = patchGameActionTime({
      now: () => END_TIME,
      startTime: START_TIME,
      nextState,
    });

    expect(patched).toEqual({ ...nextState, updateTime: SPENT_TIME });
  });

  it('should leave the game it was handed untouched when it is done', () => {
    const nextState = createState();
    const before = structuredClone(nextState);

    patchGameActionTime({
      now: () => END_TIME,
      startTime: START_TIME,
      nextState,
    });

    expect(nextState).toEqual(before);
  });
});
