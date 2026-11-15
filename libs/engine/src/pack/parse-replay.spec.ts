import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, indexOf, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../state/types/game-level';
import { ACTION_CODES } from './action-codes';
import { parseReplay } from './parse-replay';
import type { PackedReplay } from './types/packed-replay';

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

const CHOOSE_ITEM_CODE = indexOf(ACTION_CODES, 'CHOOSE_ITEM');

const LOAD_LEVEL_CODE = indexOf(ACTION_CODES, 'LOAD_LEVEL');

const JUMP_START_CODE = indexOf(ACTION_CODES, 'JUMP_START');

const INTERACT_CODE = indexOf(ACTION_CODES, 'INTERACT');

const UNKNOWN_CODE = 99;

const CHOICE_STEP = 0;

const LOAD_STEP = 3;

const JUMP_STEP = 5;

const ITEM_SLOT = 2;

const SECOND_LEVEL_INDEX = 1;

const MISSING_LEVEL_INDEX = 7;

const PACKED_STEPS = 40;

const EMPTY_STEPS = 10;

const DROPPED_STEPS = 3;

const FIRST_STEP = 0;

const SECOND_STEP = 1;

const THIRD_STEP = 2;

const createPackedReplay = (): PackedReplay => ({
  worldName: 'PACK-WORLD',
  steps: PACKED_STEPS,
  entries: [
    [CHOICE_STEP, CHOOSE_ITEM_CODE, ITEM_SLOT],
    [LOAD_STEP, LOAD_LEVEL_CODE, SECOND_LEVEL_INDEX],
    [JUMP_STEP, JUMP_START_CODE],
  ],
});

describe('parseReplay', () => {
  it('should keep the world name and the step count when the replay is unpacked', () => {
    const replay = parseReplay(createPackedReplay(), LEVELS);

    expect(replay.worldName).toBe('PACK-WORLD');
    expect(replay.steps).toBe(PACKED_STEPS);
  });

  it('should give no entries when the packed replay recorded nothing', () => {
    const replay = parseReplay(
      { worldName: 'EMPTY', steps: EMPTY_STEPS, entries: [] },
      LEVELS,
    );

    expect(replay).toEqual({
      worldName: 'EMPTY',
      steps: EMPTY_STEPS,
      entries: [],
    });
  });

  it('should unpack item choices, level loads and plain actions when the replay holds them', () => {
    const replay = parseReplay(createPackedReplay(), LEVELS);

    expect(replay.entries).toEqual([
      {
        atStep: CHOICE_STEP,
        action: { type: 'CHOOSE_ITEM', index: ITEM_SLOT },
      },
      {
        atStep: LOAD_STEP,
        action: {
          type: 'LOAD_LEVEL',
          level: LEVELS[SECOND_LEVEL_INDEX],
          levelIndex: SECOND_LEVEL_INDEX,
        },
      },
      { atStep: JUMP_STEP, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should drop the entries it cannot seat when an action is unknown or a level is missing', () => {
    const packed: PackedReplay = {
      worldName: 'W',
      steps: DROPPED_STEPS,
      entries: [
        [FIRST_STEP, UNKNOWN_CODE],
        [SECOND_STEP, LOAD_LEVEL_CODE, MISSING_LEVEL_INDEX],
        [THIRD_STEP, INTERACT_CODE],
      ],
    };

    const replay = parseReplay(packed, LEVELS);

    expect(replay.entries).toEqual([
      { atStep: THIRD_STEP, action: { type: 'INTERACT' } },
    ]);
  });

  it('should leave the packed replay unchanged when it unpacks it', () => {
    const packed = createPackedReplay();

    parseReplay(packed, LEVELS);

    expect(packed).toEqual(createPackedReplay());
  });
});
