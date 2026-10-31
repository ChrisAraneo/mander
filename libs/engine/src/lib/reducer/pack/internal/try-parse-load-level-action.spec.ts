import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { tryParseLoadLevelAction } from './try-parse-load-level-action';

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

describe('tryParseLoadLevelAction', () => {
  it('should load the numbered level when that level exists', () => {
    const action = tryParseLoadLevelAction([0, 9, 1], LEVELS);

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[1],
      levelIndex: 1,
    });
  });

  it('should load the first level when the entry names the first level', () => {
    const action = tryParseLoadLevelAction([0, 9, 0], LEVELS);

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[0],
      levelIndex: 0,
    });
  });

  it('should give nothing when the numbered level does not exist', () => {
    const action = tryParseLoadLevelAction([0, 9, 5], LEVELS);

    expect(action).toBeUndefined();
  });

  it('should give nothing when there are no levels', () => {
    const action = tryParseLoadLevelAction([0, 9, 0], []);

    expect(action).toBeUndefined();
  });
});
