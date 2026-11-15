import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, indexOf, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
import { ACTION_CODES } from '../action-codes';
import { tryParseLoadLevelAction } from './try-parse-load-level-action';

const AT_STEP = 0;

const FIRST_LEVEL_INDEX = 0;

const SECOND_LEVEL_INDEX = 1;

const MISSING_LEVEL_INDEX = 5;

const LOAD_LEVEL_CODE = indexOf(ACTION_CODES, 'LOAD_LEVEL');

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
    const action = tryParseLoadLevelAction(
      [AT_STEP, LOAD_LEVEL_CODE, SECOND_LEVEL_INDEX],
      LEVELS,
    );

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[SECOND_LEVEL_INDEX],
      levelIndex: SECOND_LEVEL_INDEX,
    });
  });

  it('should load the first level when the entry names the first level', () => {
    const action = tryParseLoadLevelAction(
      [AT_STEP, LOAD_LEVEL_CODE, FIRST_LEVEL_INDEX],
      LEVELS,
    );

    expect(action).toEqual({
      type: 'LOAD_LEVEL',
      level: LEVELS[FIRST_LEVEL_INDEX],
      levelIndex: FIRST_LEVEL_INDEX,
    });
  });

  it('should give nothing when the numbered level does not exist', () => {
    const action = tryParseLoadLevelAction(
      [AT_STEP, LOAD_LEVEL_CODE, MISSING_LEVEL_INDEX],
      LEVELS,
    );

    expect(action).toBeUndefined();
  });

  it('should give nothing when there are no levels', () => {
    const action = tryParseLoadLevelAction(
      [AT_STEP, LOAD_LEVEL_CODE, FIRST_LEVEL_INDEX],
      [],
    );

    expect(action).toBeUndefined();
  });
});
