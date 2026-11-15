import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { forEach, head, indexOf, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import type { RecordableAction } from '../../state/types/recordable-action';
import { ACTION_CODES } from '../action-codes';
import { parseReplayAction } from './parse-replay-action';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const AT_STEP = 0;

const ITEM_SLOT = 3;

const FIRST_LEVEL_INDEX = 0;

const SECOND_LEVEL_INDEX = 1;

const MISSING_LEVEL_INDEX = 5;

const CHOOSE_ITEM_CODE = indexOf(ACTION_CODES, 'CHOOSE_ITEM');

const LOAD_LEVEL_CODE = indexOf(ACTION_CODES, 'LOAD_LEVEL');

const RESTART_CODE = indexOf(ACTION_CODES, 'RESTART');

const RETIRED_CODE = size(ACTION_CODES);

const UNKNOWN_CODE = 99;

const PLAIN_TYPES: RecordableAction['type'][] = [
  'MOVE_LEFT_START',
  'MOVE_LEFT_STOP',
  'MOVE_RIGHT_START',
  'MOVE_RIGHT_STOP',
  'JUMP_START',
  'JUMP_STOP',
  'INTERACT',
  'CLOSE',
  'RESPAWN',
  'USE_STAR',
  'SHOOT',
];

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

describe('parseReplayAction', () => {
  it('should give back only the action when the entry records an action that carries nothing', () =>
    forEach(PLAIN_TYPES, (type) =>
      expect(
        parseReplayAction([AT_STEP, indexOf(ACTION_CODES, type)], LEVELS),
        type,
      ).toEqual({ type }),
    ));

  it('should give back the chosen item slot when the entry records choosing an item', () => {
    const action = parseReplayAction(
      [AT_STEP, CHOOSE_ITEM_CODE, ITEM_SLOT],
      LEVELS,
    );

    expect(action).toEqual({ type: 'CHOOSE_ITEM', index: ITEM_SLOT });
  });

  it('should seat the numbered level when the entry records loading a level', () => {
    const action = parseReplayAction(
      [AT_STEP, LOAD_LEVEL_CODE, SECOND_LEVEL_INDEX],
      LEVELS,
    );

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[SECOND_LEVEL_INDEX],
      levelIndex: SECOND_LEVEL_INDEX,
    });
  });

  it('should give nothing when the entry loads a level the world does not have', () => {
    const action = parseReplayAction(
      [AT_STEP, LOAD_LEVEL_CODE, MISSING_LEVEL_INDEX],
      LEVELS,
    );

    expect(action).toBeUndefined();
  });

  it('should restart on the first level when the entry records a restart', () => {
    const action = parseReplayAction([AT_STEP, RESTART_CODE], LEVELS);

    expect(action).toEqual({
      type: 'RESTART',
      level: LEVELS[FIRST_LEVEL_INDEX],
    });
  });

  it('should give nothing when the entry records a restart and the world has no levels', () => {
    const action = parseReplayAction([AT_STEP, RESTART_CODE], []);

    expect(action).toBeUndefined();
  });

  it('should give nothing when the entry holds the code of a retired action', () => {
    const action = parseReplayAction([AT_STEP, RETIRED_CODE], LEVELS);

    expect(action).toBeUndefined();
  });

  it('should give nothing when the entry holds an action it has never heard of', () => {
    const action = parseReplayAction([AT_STEP, UNKNOWN_CODE], LEVELS);

    expect(action).toBeUndefined();
  });
});
