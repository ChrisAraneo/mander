import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { createInitialState } from './create-initial-state';
import { patchInput } from './patch-input';

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

const LEVEL = createLevel(['....', '.S..', '####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  input: { isLeft: true, isRight: false, isJump: false },
});

describe('patchInput', () => {
  it('should press the given buttons and keep the others when a patch is given', () => {
    const state = createState();

    const patched = patchInput(state, { isJump: true });

    expect(patched.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: true,
    });
  });

  it('should keep the buttons as they are when the patch is empty', () => {
    const state = createState();

    const patched = patchInput(state, {});

    expect(patched.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: false,
    });
  });

  it('should keep the rest of the game when the buttons change', () => {
    const state = createState();

    const patched = patchInput(state, { isLeft: false, isRight: true });

    expect(omit(patched, ['input'])).toEqual(omit(state, ['input']));
  });

  it('should leave the given game unchanged when the buttons change', () => {
    const state = createState();

    patchInput(state, { isLeft: false, isJump: true });

    expect(state).toEqual(createState());
  });
});
