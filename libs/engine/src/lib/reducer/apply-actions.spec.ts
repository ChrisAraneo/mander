import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { applyActions } from './apply-actions';
import { reduce } from './reduce';
import type { Action } from './types/action';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['........', '........', '.S......', '########']);

const ACTIONS: Action[] = [
  { type: 'MOVE_RIGHT_START' },
  { type: 'TICK' },
  { type: 'JUMP_START' },
  { type: 'TICK' },
];

const createState = (): GameState => createInitialState(LEVEL, 0, []);

describe('applyActions', () => {
  it('should play the game the same as taking the actions one by one when actions are given', () => {
    const state = createState();

    const applied = applyActions(state, ACTIONS);

    expect(omit(applied, ['updateTime'])).toEqual(
      omit(
        reduce(
          reduce(reduce(reduce(state, ACTIONS[0]), ACTIONS[1]), ACTIONS[2]),
          ACTIONS[3],
        ),
        ['updateTime'],
      ),
    );
  });

  it('should keep the game as it was when no actions are given', () => {
    const state = createState();

    const applied = applyActions(state, []);

    expect(omit(applied, ['updateTime'])).toEqual(omit(state, ['updateTime']));
  });

  it('should leave the given game unchanged when actions are given', () => {
    const state = createState();

    applyActions(state, ACTIONS);

    expect(state).toEqual(createState());
  });
});
