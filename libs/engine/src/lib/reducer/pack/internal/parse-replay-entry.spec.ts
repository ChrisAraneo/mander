import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { parseReplayEntry } from './parse-replay-entry';

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

const LEVELS: GameLevel[] = [
  createLevel('ONE', ['...', '###']),
  createLevel('TWO', ['....', '####']),
];

describe('parseReplayEntry', () => {
  it('should pair the step with the action when the entry records a known action', () => {
    const recorded = parseReplayEntry([12, 6], LEVELS);

    expect(recorded).toEqual({ atStep: 12, action: { type: 'INTERACT' } });
  });

  it('should pair the step with the level when the entry records loading a level', () => {
    const recorded = parseReplayEntry([30, 9, 1], LEVELS);

    expect(recorded).toEqual({
      atStep: 30,
      action: { type: 'LOAD_LEVEL', level: LEVELS[1], levelIndex: 1 },
    });
  });

  it('should give nothing when the entry holds an action it has never heard of', () => {
    const recorded = parseReplayEntry([12, 99], LEVELS);

    expect(recorded).toBeUndefined();
  });

  it('should give nothing when the entry loads a level the world does not have', () => {
    const recorded = parseReplayEntry([12, 9, 5], LEVELS);

    expect(recorded).toBeUndefined();
  });
});
