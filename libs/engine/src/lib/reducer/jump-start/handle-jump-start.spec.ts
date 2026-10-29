import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { handleJumpStart } from './handle-jump-start';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  input: { isLeft: true, isRight: false, isJump: false },
});

const createDyingState = (): GameState => ({
  ...createState(),
  player: {
    ...createState().player,
    timers: { ...createState().player.timers, death: 0.5 },
  },
});

describe('handleJumpStart', () => {
  it('should leave the state alone when the jump button is already held', () => {
    const state: GameState = {
      ...createState(),
      input: { isLeft: false, isRight: false, isJump: true },
    };

    const started = handleJumpStart(state);

    expect(started).toBe(state);
  });

  it('should hold the jump button and keep the other buttons when the player is alive', () => {
    const started = handleJumpStart(createState());

    expect(started.input).toEqual({
      isLeft: true,
      isRight: false,
      isJump: true,
    });
  });

  it('should queue a jump when the player is alive in a level being played', () => {
    const state = createState();

    const started = handleJumpStart(state);

    expect(started.player).toEqual({
      ...state.player,
      statuses: { ...state.player.statuses, isJumpQueued: true },
    });
  });

  it('should hold the jump button but leave the player alone when the player is dying', () => {
    const state = createDyingState();

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the chest is open', () => {
    const state: GameState = { ...createState(), status: 'CHEST' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the level is complete', () => {
    const state: GameState = { ...createState(), status: 'COMPLETE' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should hold the jump button but leave the player alone when the game is over', () => {
    const state: GameState = { ...createState(), status: 'GAME_OVER' };

    const started = handleJumpStart(state);

    expect(started.input.isJump).toBe(true);
    expect(started.player).toBe(state.player);
  });

  it('should leave the given state unchanged when the player jumps', () => {
    const state = createState();

    handleJumpStart(state);

    expect(state).toEqual(createState());
  });
});
