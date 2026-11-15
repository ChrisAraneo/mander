import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, indexOf, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { ACTION_CODES } from '../action-codes';
import { parseReplayEntry } from './parse-replay-entry';

const AT_STEP = 12;

const LATER_STEP = 30;

const SECOND_LEVEL_INDEX = 1;

const MISSING_LEVEL_INDEX = 5;

const INTERACT_CODE = indexOf(ACTION_CODES, 'INTERACT');

const LOAD_LEVEL_CODE = indexOf(ACTION_CODES, 'LOAD_LEVEL');

const UNKNOWN_CODE = 99;

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
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

const LEVELS: GameLevel[] = [
  createLevel('ONE', ['...', '###']),
  createLevel('TWO', ['....', '####']),
];

describe('parseReplayEntry', () => {
  it('should pair the step with the action when the entry records a known action', () => {
    const recorded = parseReplayEntry([AT_STEP, INTERACT_CODE], LEVELS);

    expect(recorded).toEqual({ atStep: AT_STEP, action: { type: 'INTERACT' } });
  });

  it('should pair the step with the level when the entry records loading a level', () => {
    const recorded = parseReplayEntry(
      [LATER_STEP, LOAD_LEVEL_CODE, SECOND_LEVEL_INDEX],
      LEVELS,
    );

    expect(recorded).toEqual({
      atStep: LATER_STEP,
      action: {
        type: 'LOAD_LEVEL',
        level: LEVELS[SECOND_LEVEL_INDEX],
        levelIndex: SECOND_LEVEL_INDEX,
      },
    });
  });

  it('should give nothing when the entry holds an action it has never heard of', () => {
    const recorded = parseReplayEntry([AT_STEP, UNKNOWN_CODE], LEVELS);

    expect(recorded).toBeUndefined();
  });

  it('should give nothing when the entry loads a level the world does not have', () => {
    const recorded = parseReplayEntry(
      [AT_STEP, LOAD_LEVEL_CODE, MISSING_LEVEL_INDEX],
      LEVELS,
    );

    expect(recorded).toBeUndefined();
  });
});
