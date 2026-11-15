import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { createInitialState } from '../start/create-initial-state';
import { removeUpdateTime } from './remove-update-time';
import type { GameLevel } from './types/game-level';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['.....', '.S...', '#####'];

const createLevel = (): GameLevel => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LATER_UPDATE_TIME = 42;

describe('removeUpdateTime', () => {
  it('should drop the moment of the last update when it is handed a game', () => {
    const stripped = removeUpdateTime(
      createInitialState(createLevel(), FIRST_LEVEL_INDEX, []),
    );

    expect('updateTime' in stripped).toBe(false);
  });

  it('should keep every other part of the game when it drops the moment', () => {
    const state = createInitialState(createLevel(), FIRST_LEVEL_INDEX, []);

    const stripped = removeUpdateTime(state);

    expect(stripped.status).toBe(state.status);
    expect(stripped.player).toEqual(state.player);
    expect(stripped.level).toEqual(state.level);
  });

  it('should read the same for two games that differ only in that moment', () => {
    const state = createInitialState(createLevel(), FIRST_LEVEL_INDEX, []);

    expect(removeUpdateTime(state)).toEqual(
      removeUpdateTime({ ...state, updateTime: LATER_UPDATE_TIME }),
    );
  });

  it('should leave the game it was handed untouched when it drops the moment', () => {
    const state = createInitialState(createLevel(), FIRST_LEVEL_INDEX, []);

    removeUpdateTime(state);

    expect(state).toEqual(
      createInitialState(createLevel(), FIRST_LEVEL_INDEX, []),
    );
  });
});
