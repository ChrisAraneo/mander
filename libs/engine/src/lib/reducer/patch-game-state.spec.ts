import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { constant, head, map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { nextGameState } from './next-game-state';
import { patchGameState } from './patch-game-state';
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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['........', '........', '.S......', '########']);

const ACTIONS: Action[] = [
  { type: 'MOVE_RIGHT_START' },
  { type: 'TICK' },
  { type: 'JUMP_START' },
  { type: 'TICK' },
];

const createState = (): GameState => createInitialState(LEVEL, 0, []);

describe('patchGameState', () => {
  it('should play the game the same as taking the actions one by one when actions are given', () => {
    const state = createState();

    const applied = patchGameState(state, ACTIONS, constant(0));

    expect(omit(applied, ['updateTime'])).toEqual(
      omit(
        nextGameState(
          nextGameState(
            nextGameState(
              nextGameState(state, ACTIONS[0], constant(0)),
              ACTIONS[1],
              constant(0),
            ),
            ACTIONS[2],
            constant(0),
          ),
          ACTIONS[3],
          constant(0),
        ),
        ['updateTime'],
      ),
    );
  });

  it('should keep the game as it was when no actions are given', () => {
    const state = createState();

    const applied = patchGameState(state, [], constant(0));

    expect(omit(applied, ['updateTime'])).toEqual(omit(state, ['updateTime']));
  });

  it('should leave the given game unchanged when actions are given', () => {
    const state = createState();

    patchGameState(state, ACTIONS, constant(0));

    expect(state).toEqual(createState());
  });
});
