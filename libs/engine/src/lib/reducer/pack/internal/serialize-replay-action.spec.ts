import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { serializeReplayAction } from './serialize-replay-action';

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
});

const LEVEL = createLevel('ONE', ['...', '###']);

describe('serializeReplayAction', () => {
  it('should write the code and the item slot when the player chooses an item', () => {
    const packed = serializeReplayAction({ type: 'CHOOSE_ITEM', index: 2 });

    expect(packed).toEqual([7, 2]);
  });

  it('should write the code and the level number when a level is loaded', () => {
    const packed = serializeReplayAction({
      type: 'LOAD_LEVEL',
      level: LEVEL,
      levelIndex: 3,
    });

    expect(packed).toEqual([9, 3]);
  });

  it('should write only the code when the player jumps', () => {
    const packed = serializeReplayAction({ type: 'JUMP_START' });

    expect(packed).toEqual([4]);
  });

  it('should leave the level out when the world is restarted', () => {
    const packed = serializeReplayAction({ type: 'RESTART', level: LEVEL });

    expect(packed).toEqual([11]);
  });
});
