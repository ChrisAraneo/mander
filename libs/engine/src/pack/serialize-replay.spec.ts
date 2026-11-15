import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { compact, head, indexOf, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { RecordedAction } from '../recorder/types/recorded-action';
import type { Replay } from '../recorder/types/replay';
import type { GameLevel } from '../state/types/game-level';
import type { RecordableAction } from '../state/types/recordable-action';
import { ACTION_CODES } from './action-codes';
import { parseReplay } from './parse-replay';
import { serializeReplay } from './serialize-replay';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  P: TILE_PORTAL,
};

const ROWS = [
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '....................',
  '..S............P....',
  '####################',
  '####################',
  '####################',
];

const createItem = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createLevel = (seed: string): GameLevel => ({
  seed,
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [createItem('CARD-0')],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVELS: GameLevel[] = [createLevel('ONE'), createLevel('TWO')];

const STEP_SPACING = 4;

const LONG_RUN_STEPS = 36_000;

const LONG_RUN_ENTRIES = 40;

const LONG_RUN_SPACING = 900;

const LONG_RUN_BYTE_BUDGET = 600;

const MISSING_LEVEL_INDEX = 9;

const SECOND_LEVEL_INDEX = 1;

const FIRST_STEP = 0;

const SECOND_STEP = 1;

const TWO_STEPS = 2;

const ONE_ENTRY = 1;

const UNKNOWN_CODE = 99;

const INTERACT_CODE = indexOf(ACTION_CODES, 'INTERACT');

const SCRIPT: RecordableAction[] = [
  { type: 'MOVE_RIGHT_START' },
  { type: 'JUMP_START' },
  { type: 'JUMP_STOP' },
  { type: 'MOVE_RIGHT_STOP' },
  { type: 'MOVE_LEFT_START' },
  { type: 'MOVE_LEFT_STOP' },
  { type: 'INTERACT' },
  { type: 'CHOOSE_ITEM', index: 1 },
  { type: 'USE_STAR' },
  { type: 'CLOSE' },
  { type: 'RESPAWN' },
  {
    type: 'LOAD_LEVEL',
    level: LEVELS[SECOND_LEVEL_INDEX],
    levelIndex: SECOND_LEVEL_INDEX,
  },
  { type: 'RESTART', level: LEVELS[0] },
];

const createReplay = (): Replay => ({
  worldName: 'PACK-WORLD',
  steps: size(SCRIPT) * STEP_SPACING,
  entries: map(SCRIPT, (action, index) => ({
    atStep: index * STEP_SPACING,
    action,
  })),
});

describe('serializeReplay', () => {
  it('should bring every action back the way it went in when the replay is unpacked', () => {
    const restored = parseReplay(serializeReplay(createReplay()), LEVELS);

    expect(restored.worldName).toBe('PACK-WORLD');
    expect(map(restored.entries, (entry) => entry.action)).toEqual(SCRIPT);
    expect(map(restored.entries, (entry) => entry.atStep)).toEqual(
      map(SCRIPT, (_, index) => index * STEP_SPACING),
    );
  });

  it('should carry the step count through when the replay is unpacked', () => {
    expect(parseReplay(serializeReplay(createReplay()), LEVELS).steps).toBe(
      size(SCRIPT) * STEP_SPACING,
    );
  });

  it('should leave the level grids behind when it packs a replay', () => {
    const written = JSON.stringify(serializeReplay(createReplay()));

    expect(written).not.toContain('"tiles"');
    expect(written).not.toContain('"chestItems"');
  });

  it('should cost nothing per step when the run ran long', () => {
    const long: Replay = {
      worldName: 'W',
      steps: LONG_RUN_STEPS,
      entries: times(LONG_RUN_ENTRIES, (index): RecordedAction => ({
        atStep: index * LONG_RUN_SPACING,
        action: { type: 'JUMP_START' },
      })),
    };

    expect(size(JSON.stringify(serializeReplay(long)))).toBeLessThan(
      LONG_RUN_BYTE_BUDGET,
    );
  });

  it('should drop the entry rather than hand back a broken run when it cannot be seated', () => {
    const packed = serializeReplay({
      worldName: 'W',
      steps: TWO_STEPS,
      entries: [
        {
          atStep: FIRST_STEP,
          action: {
            type: 'LOAD_LEVEL',
            level: LEVELS[SECOND_LEVEL_INDEX],
            levelIndex: MISSING_LEVEL_INDEX,
          },
        },
        { atStep: SECOND_STEP, action: { type: 'INTERACT' } },
      ],
    });

    const restored = parseReplay(packed, LEVELS);

    expect(size(restored.entries)).toBe(ONE_ENTRY);
    expect(restored.entries[0].action).toEqual({ type: 'INTERACT' });
  });

  it('should shrug the entry off when its action is one it has never heard of', () => {
    const restored = parseReplay(
      {
        worldName: 'W',
        steps: TWO_STEPS,
        entries: [
          [FIRST_STEP, UNKNOWN_CODE],
          [SECOND_STEP, INTERACT_CODE],
        ],
      },
      LEVELS,
    );

    expect(size(compact(restored.entries))).toBe(ONE_ENTRY);
  });

  it('should pack no entries when the replay recorded nothing', () => {
    const packed = serializeReplay({
      worldName: 'EMPTY',
      steps: TWO_STEPS,
      entries: [],
    });

    expect(packed).toEqual({
      worldName: 'EMPTY',
      steps: TWO_STEPS,
      entries: [],
    });
  });

  it('should leave the replay it was handed untouched when it packs it', () => {
    const replay = createReplay();

    serializeReplay(replay);

    expect(replay).toEqual(createReplay());
  });
});
