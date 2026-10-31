import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
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

const createPackedReplay = (): PackedReplay => ({
  worldName: 'PACK-WORLD',
  steps: 40,
  entries: [
    [0, 7, 2],
    [3, 9, 1],
    [5, 4],
  ],
});

describe('parsePackedReplay', () => {
  it('should keep the world name and the step count when the replay is unpacked', () => {
    const replay = parseReplay(createPackedReplay(), LEVELS);

    expect(replay.worldName).toBe('PACK-WORLD');
    expect(replay.steps).toBe(40);
  });

  it('should give no entries when the packed replay recorded nothing', () => {
    const replay = parseReplay(
      { worldName: 'EMPTY', steps: 10, entries: [] },
      LEVELS,
    );

    expect(replay).toEqual({ worldName: 'EMPTY', steps: 10, entries: [] });
  });

  it('should unpack item choices, level loads and plain actions when the replay holds them', () => {
    const replay = parseReplay(createPackedReplay(), LEVELS);

    expect(replay.entries).toEqual([
      { atStep: 0, action: { type: 'CHOOSE_ITEM', index: 2 } },
      {
        atStep: 3,
        action: { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
      },
      { atStep: 5, action: { type: 'JUMP_START' } },
    ]);
  });

  it('should drop the entries it cannot seat when an action is unknown or a level is missing', () => {
    const packed: PackedReplay = {
      worldName: 'W',
      steps: 3,
      entries: [
        [0, 99],
        [1, 9, 7],
        [2, 6],
      ],
    };

    const replay = parseReplay(packed, LEVELS);

    expect(replay.entries).toEqual([
      { atStep: 2, action: { type: 'INTERACT' } },
    ]);
  });

  it('should leave the packed replay unchanged when it unpacks it', () => {
    const packed = createPackedReplay();

    parseReplay(packed, LEVELS);

    expect(packed).toEqual(createPackedReplay());
  });
});
