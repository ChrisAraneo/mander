import {
  DOUBLE_HEART,
  FIXED_STEP_SECONDS,
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { forEach, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { handleChooseItem } from '../../choose-item/handle-choose-item';
import { handleClose } from '../../close/handle-close';
import { handleInteract } from '../../interact/handle-interact';
import { handleJumpStart } from '../../jump-start/handle-jump-start';
import { handleJumpStop } from '../../jump-stop/handle-jump-stop';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { handleLoadLevel } from '../../load-level/handle-load-level';
import { handleMoveLeftStart } from '../../move-left-start/handle-move-left-start';
import { handleMoveLeftStop } from '../../move-left-stop/handle-move-left-stop';
import { handleMoveRightStart } from '../../move-right-start/handle-move-right-start';
import { handleMoveRightStop } from '../../move-right-stop/handle-move-right-stop';
import { handleRespawn } from '../../respawn/handle-respawn';
import { handleRestart } from '../../restart/handle-restart';
import { patchShot } from '../../shoot/patch-shot';
import { createInitialState } from '../../start/create-initial-state';
import type { Action } from '../../state/types/action';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { handleTick } from '../../tick/handle-tick';
import { patchStarUse } from '../../use-star/patch-star-use';
import { handleGameAction } from './handle-game-action';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const START_TIME = 1200;

const FIRST_CARD_INDEX = 0;

const NEXT_LEVEL_INDEX = 1;

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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const OTHER_LEVEL = createLevel(['......', '....S.', '######']);

const createPlayingState = (): GameState =>
  createInitialState(LEVEL, FIRST_LEVEL_INDEX, [TWO_BULLETS, STAR]);

const createChestState = (): GameState => ({
  ...createPlayingState(),
  status: 'CHEST',
  hasKey: true,
  isNearChest: true,
});

const createClock = () => () => START_TIME;

interface ActionCase {
  action: Action;
  state: GameState;
  expected: GameState;
}

const CASES: ActionCase[] = [
  {
    action: { type: 'TICK' },
    state: createPlayingState(),
    expected: handleTick(createPlayingState(), FIXED_STEP_SECONDS),
  },
  {
    action: { type: 'MOVE_LEFT_START' },
    state: createPlayingState(),
    expected: handleMoveLeftStart(createPlayingState()),
  },
  {
    action: { type: 'MOVE_LEFT_STOP' },
    state: createPlayingState(),
    expected: handleMoveLeftStop(createPlayingState()),
  },
  {
    action: { type: 'MOVE_RIGHT_START' },
    state: createPlayingState(),
    expected: handleMoveRightStart(createPlayingState()),
  },
  {
    action: { type: 'MOVE_RIGHT_STOP' },
    state: createPlayingState(),
    expected: handleMoveRightStop(createPlayingState()),
  },
  {
    action: { type: 'JUMP_START' },
    state: createPlayingState(),
    expected: handleJumpStart(createPlayingState()),
  },
  {
    action: { type: 'JUMP_STOP' },
    state: createPlayingState(),
    expected: handleJumpStop(createPlayingState()),
  },
  {
    action: { type: 'INTERACT' },
    state: createPlayingState(),
    expected: handleInteract(createPlayingState()),
  },
  {
    action: { type: 'CHOOSE_ITEM', index: FIRST_CARD_INDEX },
    state: createChestState(),
    expected: handleChooseItem(createChestState(), FIRST_CARD_INDEX),
  },
  {
    action: { type: 'USE_STAR' },
    state: createPlayingState(),
    expected: patchStarUse(createPlayingState()),
  },
  {
    action: { type: 'SHOOT' },
    state: createPlayingState(),
    expected: patchShot(createPlayingState()),
  },
  {
    action: { type: 'CLOSE' },
    state: createChestState(),
    expected: handleClose(createChestState()),
  },
  {
    action: { type: 'RESPAWN' },
    state: createPlayingState(),
    expected: handleRespawn(createPlayingState()),
  },
  {
    action: {
      type: 'LOAD_LEVEL',
      level: OTHER_LEVEL,
      levelIndex: NEXT_LEVEL_INDEX,
    },
    state: createPlayingState(),
    expected: handleLoadLevel(
      createPlayingState(),
      OTHER_LEVEL,
      NEXT_LEVEL_INDEX,
    ),
  },
  {
    action: { type: 'RESTART', level: OTHER_LEVEL },
    state: createPlayingState(),
    expected: handleRestart(OTHER_LEVEL),
  },
];

describe('handleGameAction', () => {
  it('should hand the game to the handler of the action when it is given any kind of action', () =>
    forEach(CASES, ({ action, state, expected }) =>
      expect(
        handleGameAction({
          state,
          action,
          now: createClock(),
          startTime: START_TIME,
        }).nextState,
        action.type,
      ).toEqual(expected),
    ));

  it('should pass the clock on when it hands the action over', () => {
    const now = createClock();

    const handled = handleGameAction({
      state: createPlayingState(),
      action: { type: 'TICK' },
      now,
      startTime: START_TIME,
    });

    expect(handled.now).toBe(now);
  });

  it('should pass the starting time on when it hands the action over', () => {
    const handled = handleGameAction({
      state: createPlayingState(),
      action: { type: 'TICK' },
      now: createClock(),
      startTime: START_TIME,
    });

    expect(handled.startTime).toBe(START_TIME);
  });

  it('should leave the game it was handed untouched when it hands the action over', () => {
    const state = createPlayingState();
    const before = structuredClone(state);

    handleGameAction({
      state,
      action: { type: 'TICK' },
      now: createClock(),
      startTime: START_TIME,
    });

    expect(state).toEqual(before);
  });
});
