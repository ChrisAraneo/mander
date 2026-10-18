import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { handleJumpStop } from './handle-jump-stop';

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
  input: { isLeft: false, isRight: true, isJump: true },
});

describe('handleJumpStop', () => {
  it('should let go of the jump button and keep the other buttons when the player stops jumping', () => {
    const stopped = handleJumpStop(createState());

    expect(stopped.input).toEqual({
      isLeft: false,
      isRight: true,
      isJump: false,
    });
  });

  it('should keep the jump button let go when it was not held', () => {
    const state: GameState = {
      ...createState(),
      input: { isLeft: true, isRight: false, isJump: false },
    };

    const stopped = handleJumpStop(state);

    expect(stopped.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: false,
    });
  });

  it('should keep the player when the player stops jumping', () => {
    const state = createState();

    const stopped = handleJumpStop(state);

    expect(stopped.player).toBe(state.player);
  });

  it('should leave the given state unchanged when the player stops jumping', () => {
    const state = createState();

    handleJumpStop(state);

    expect(state).toEqual(createState());
  });
});
