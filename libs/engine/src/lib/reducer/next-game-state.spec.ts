import {
  DOUBLE_HEART,
  FIXED_STEP_SECONDS,
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { constant, head, map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { handleChooseItem } from './choose-item/handle-choose-item';
import { handleClose } from './close/handle-close';
import { handleInteract } from './interact/handle-interact';
import { handleJumpStart } from './jump-start/handle-jump-start';
import { handleJumpStop } from './jump-stop/handle-jump-stop';
import { handleLoadLevel } from './load-level/handle-load-level';
import { handleMoveLeftStart } from './move-left-start/handle-move-left-start';
import { handleMoveLeftStop } from './move-left-stop/handle-move-left-stop';
import { handleMoveRightStart } from './move-right-start/handle-move-right-start';
import { handleMoveRightStop } from './move-right-stop/handle-move-right-stop';
import { nextGameState } from './next-game-state';
import { handleRespawn } from './respawn/handle-respawn';
import { handleRestart } from './restart/handle-restart';
import { patchShot } from './shoot/patch-shot';
import { handleTick } from './tick/handle-tick';
import { patchStarUse } from './use-star/patch-star-use';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  E: TILE_ENEMY,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [DOUBLE_HEART],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['..........', '.S.....E..', '##########']);

const OTHER_LEVEL = createLevel([
  '........',
  '......S.',
  '..E.....',
  '########',
]);

const createPlayingState = (): GameState =>
  createInitialState(LEVEL, 0, [TWO_BULLETS, STAR]);

const createChestState = (): GameState => ({
  ...createPlayingState(),
  status: 'CHEST',
  hasKey: true,
  isNearChest: true,
});

const createHeldButtonsState = (): GameState => ({
  ...createPlayingState(),
  input: { isLeft: true, isRight: true, isJump: true },
});

describe('nextGameState', () => {
  it('should move the game on by one fixed step when the action is a tick', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'TICK' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleTick(state, FIXED_STEP_SECONDS), ['updateTime']),
    );
  });

  it('should start moving the player left when the action presses left', () => {
    const state = createPlayingState();

    const reduced = nextGameState(
      state,
      { type: 'MOVE_LEFT_START' },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleMoveLeftStart(state), ['updateTime']),
    );
  });

  it('should stop moving the player left when the action lets go of left', () => {
    const state = createHeldButtonsState();

    const reduced = nextGameState(
      state,
      { type: 'MOVE_LEFT_STOP' },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleMoveLeftStop(state), ['updateTime']),
    );
  });

  it('should start moving the player right when the action presses right', () => {
    const state = createPlayingState();

    const reduced = nextGameState(
      state,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleMoveRightStart(state), ['updateTime']),
    );
  });

  it('should stop moving the player right when the action lets go of right', () => {
    const state = createHeldButtonsState();

    const reduced = nextGameState(
      state,
      { type: 'MOVE_RIGHT_STOP' },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleMoveRightStop(state), ['updateTime']),
    );
  });

  it('should queue a jump when the action presses jump', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'JUMP_START' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleJumpStart(state), ['updateTime']),
    );
  });

  it('should let go of the jump when the action releases jump', () => {
    const state = createHeldButtonsState();

    const reduced = nextGameState(state, { type: 'JUMP_STOP' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleJumpStop(state), ['updateTime']),
    );
  });

  it('should open the chest when the action is an interaction beside the chest with the key', () => {
    const state: GameState = {
      ...createPlayingState(),
      hasKey: true,
      isNearChest: true,
    };

    const reduced = nextGameState(state, { type: 'INTERACT' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleInteract(state), ['updateTime']),
    );
  });

  it('should take the chosen chest item when the action chooses an item', () => {
    const state = createChestState();

    const reduced = nextGameState(
      state,
      { type: 'CHOOSE_ITEM', index: 0 },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleChooseItem(state, 0), ['updateTime']),
    );
  });

  it('should spend a star when the action uses a star', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'USE_STAR' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(patchStarUse(state), ['updateTime']),
    );
  });

  it('should fire a bullet when the action shoots', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'SHOOT' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(patchShot(state), ['updateTime']),
    );
  });

  it('should close the chest when the action closes it', () => {
    const state = createChestState();

    const reduced = nextGameState(state, { type: 'CLOSE' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleClose(state), ['updateTime']),
    );
  });

  it('should bring the player back when the action is a respawn', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'RESPAWN' }, constant(0));

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleRespawn(state), ['updateTime']),
    );
  });

  it('should load the given level when the action loads a level', () => {
    const state = createPlayingState();

    const reduced = nextGameState(
      state,
      {
        type: 'LOAD_LEVEL',
        level: OTHER_LEVEL,
        levelIndex: 1,
      },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleLoadLevel(state, OTHER_LEVEL, 1), ['updateTime']),
    );
  });

  it('should start a new game on the given level when the action is a restart', () => {
    const state = createPlayingState();

    const reduced = nextGameState(
      state,
      {
        type: 'RESTART',
        level: OTHER_LEVEL,
      },
      constant(0),
    );

    expect(omit(reduced, ['updateTime'])).toEqual(
      omit(handleRestart(OTHER_LEVEL), ['updateTime']),
    );
  });

  it('should record a time taken of zero or more when an action is reduced', () => {
    const state = createPlayingState();

    const reduced = nextGameState(state, { type: 'TICK' }, constant(0));

    expect(reduced.updateTime).toBeGreaterThanOrEqual(0);
  });
});
