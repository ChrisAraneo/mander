import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { parseReplayAction } from './parse-replay-action';

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
});

const LEVELS: GameLevel[] = [
  createLevel('ONE', ['...', '###']),
  createLevel('TWO', ['....', '####']),
];

describe('parseReplayAction', () => {
  it('should give back the chosen item slot when the entry records choosing an item', () => {
    const action = parseReplayAction([0, 7, 3], LEVELS);

    expect(action).toEqual({ type: 'CHOOSE_ITEM', index: 3 });
  });

  it('should seat the numbered level when the entry records loading a level', () => {
    const action = parseReplayAction([0, 9, 1], LEVELS);

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[1],
      levelIndex: 1,
    });
  });

  it('should give nothing when the entry loads a level the world does not have', () => {
    const action = parseReplayAction([0, 9, 5], LEVELS);

    expect(action).toBeUndefined();
  });

  it('should restart on the first level when the entry records a restart', () => {
    const action = parseReplayAction([0, 11], LEVELS);

    expect(action).toEqual({ type: 'RESTART', level: LEVELS[0] });
  });

  it('should give nothing when the entry records a restart and the world has no levels', () => {
    const action = parseReplayAction([0, 11], []);

    expect(action).toBeUndefined();
  });

  it('should give back only the action when the entry records a plain interaction', () => {
    const action = parseReplayAction([0, 6], LEVELS);

    expect(action).toEqual({ type: 'INTERACT' });
  });

  it('should give back only the action when the entry records toggling the moon magnet', () => {
    const action = parseReplayAction([0, 14], LEVELS);

    expect(action).toEqual({ type: 'TOGGLE_MOON_MAGNET' });
  });

  it('should give nothing when the entry holds an action it has never heard of', () => {
    const action = parseReplayAction([0, 99], LEVELS);

    expect(action).toBeUndefined();
  });
});
