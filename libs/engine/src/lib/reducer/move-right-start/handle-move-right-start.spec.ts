import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { handleMoveRightStart } from './handle-move-right-start';

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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  input: { isLeft: true, isRight: false, isJump: true },
});

describe('handleMoveRightStart', () => {
  it('should hold the right button and keep the left and jump buttons when the player presses right', () => {
    const state = createState();

    const moved = handleMoveRightStart(state);

    expect(moved.input).toEqual({ isLeft: true, isRight: true, isJump: true });
  });

  it('should leave the rest of the game alone when the player presses right', () => {
    const state = createState();

    const moved = handleMoveRightStart(state);

    expect(moved).toEqual({ ...state, input: moved.input });
  });

  it('should leave the given state unchanged when the player presses right', () => {
    const state = createState();

    handleMoveRightStart(state);

    expect(state).toEqual(createState());
  });
});
