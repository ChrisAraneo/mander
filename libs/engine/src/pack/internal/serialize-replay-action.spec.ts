import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { forEach, head, indexOf, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import type { RecordableAction } from '../../state/types/recordable-action';
import { ACTION_CODES } from '../action-codes';
import { serializeReplayAction } from './serialize-replay-action';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const ITEM_SLOT = 2;

const LEVEL_NUMBER = 3;

const CHOOSE_ITEM_CODE = indexOf(ACTION_CODES, 'CHOOSE_ITEM');

const LOAD_LEVEL_CODE = indexOf(ACTION_CODES, 'LOAD_LEVEL');

const JUMP_START_CODE = indexOf(ACTION_CODES, 'JUMP_START');

const RESTART_CODE = indexOf(ACTION_CODES, 'RESTART');

const PLAIN_ACTIONS: RecordableAction[] = [
  { type: 'MOVE_LEFT_START' },
  { type: 'MOVE_LEFT_STOP' },
  { type: 'MOVE_RIGHT_START' },
  { type: 'MOVE_RIGHT_STOP' },
  { type: 'JUMP_START' },
  { type: 'JUMP_STOP' },
  { type: 'INTERACT' },
  { type: 'CLOSE' },
  { type: 'RESPAWN' },
  { type: 'USE_STAR' },
  { type: 'SHOOT' },
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

const LEVEL = createLevel('ONE', ['...', '###']);

describe('serializeReplayAction', () => {
  it('should write only the code when the action carries nothing', () =>
    forEach(PLAIN_ACTIONS, (action) =>
      expect(serializeReplayAction(action), action.type).toEqual([
        indexOf(ACTION_CODES, action.type),
      ]),
    ));

  it('should write the code and the item slot when the player chooses an item', () => {
    const packed = serializeReplayAction({
      type: 'CHOOSE_ITEM',
      index: ITEM_SLOT,
    });

    expect(packed).toEqual([CHOOSE_ITEM_CODE, ITEM_SLOT]);
  });

  it('should write the code and the level number when a level is loaded', () => {
    const packed = serializeReplayAction({
      type: 'LOAD_LEVEL',
      level: LEVEL,
      levelIndex: LEVEL_NUMBER,
    });

    expect(packed).toEqual([LOAD_LEVEL_CODE, LEVEL_NUMBER]);
  });

  it('should write only the code when the player jumps', () => {
    const packed = serializeReplayAction({ type: 'JUMP_START' });

    expect(packed).toEqual([JUMP_START_CODE]);
  });

  it('should leave the level out when the world is restarted', () => {
    const packed = serializeReplayAction({ type: 'RESTART', level: LEVEL });

    expect(packed).toEqual([RESTART_CODE]);
  });
});
