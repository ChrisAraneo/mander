import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { compact, head, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import type { RecordedAction } from '../recorder/types/recorded-action';
import type { Replay } from '../recorder/types/replay';
import type { RecordableAction } from '../types/recordable-action';
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

const createTestLevel = (seed: string): GameLevel => ({
  seed,
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [createItem('CARD-0')],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVELS: GameLevel[] = [createTestLevel('ONE'), createTestLevel('TWO')];

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
  { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
  { type: 'RESTART', level: LEVELS[0] },
];

const createReplay = (): Replay => ({
  worldName: 'PACK-WORLD',
  steps: size(SCRIPT) * 4,
  entries: map(SCRIPT, (action, index) => ({ atStep: index * 4, action })),
});

describe('serializeReplay', () => {
  it('should bring every action back the way it went in when the replay is unpacked', () => {
    const restored = parseReplay(serializeReplay(createReplay()), LEVELS);

    expect(restored.worldName).toBe('PACK-WORLD');
    expect(map(restored.entries, (entry) => entry.action)).toEqual(SCRIPT);
    expect(map(restored.entries, (entry) => entry.atStep)).toEqual(
      map(SCRIPT, (_, index) => index * 4),
    );
  });

  it('should carry the step count through when the replay is unpacked', () => {
    expect(parseReplay(serializeReplay(createReplay()), LEVELS).steps).toBe(
      size(SCRIPT) * 4,
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
      steps: 36_000,
      entries: times(40, (index): RecordedAction => ({
        atStep: index * 900,
        action: { type: 'JUMP_START' },
      })),
    };

    expect(size(JSON.stringify(serializeReplay(long)))).toBeLessThan(600);
  });

  it('should drop the entry rather than hand back a broken run when it cannot be seated', () => {
    const packed = serializeReplay({
      worldName: 'W',
      steps: 2,
      entries: [
        {
          atStep: 0,
          action: { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 9 },
        },
        { atStep: 1, action: { type: 'INTERACT' } },
      ],
    });

    const restored = parseReplay(packed, LEVELS);

    expect(size(restored.entries)).toBe(1);
    expect(restored.entries[0].action).toEqual({ type: 'INTERACT' });
  });

  it('should shrug the entry off when its action is one it has never heard of', () => {
    const restored = parseReplay(
      {
        worldName: 'W',
        steps: 2,
        entries: [
          [0, 99],
          [1, 6],
        ],
      },
      LEVELS,
    );

    expect(size(compact(restored.entries))).toBe(1);
  });
});
