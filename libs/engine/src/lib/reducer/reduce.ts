import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../actions';
import type { GameState } from '../state';
import { createEnemies, createPlayer } from '../state';
import { tick } from './tick';
import { withInput } from './with-input';

const startJump = (state: GameState): GameState => {
  if (state.input.isJump) return state;
  return {
    ...withInput(state, { isJump: true }),
    player:
      state.status === 'playing'
        ? { ...state.player, isJumpQueued: true }
        : state.player,
  };
};

const interact = (state: GameState): GameState => {
  if (state.status !== 'playing') return state;
  if (state.isNearChest && state.hasKey) return { ...state, status: 'chest' };
  if (state.isNearPortal) return { ...state, status: 'complete' };
  return state;
};

const chooseItem = (state: GameState, index: number): GameState => {
  if (state.status !== 'chest') return state;
  const items = state.level.chestItems;
  if (index < 0 || index >= items.length) return state;
  return {
    ...state,
    status: 'playing',
    isChestOpened: true,
    isNearChest: false,
    inventory: concat(state.inventory, items[index]),
  };
};

const close = (state: GameState): GameState => {
  if (state.status !== 'chest') return state;
  return { ...state, status: 'playing' };
};

const respawn = (state: GameState): GameState => {
  if (state.status !== 'playing') return state;
  return { ...state, player: createPlayer(state.level) };
};

const loadLevel = (
  state: GameState,
  level: GameState['level'],
  levelIndex: number,
): GameState => ({
  ...state,
  level,
  levelIndex,
  player: createPlayer(level),
  enemies: createEnemies(level),
  status: 'playing',
  hasKey: false,
  isChestOpened: false,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
});

export const reduce = (state: GameState, action: Action): GameState =>
  match(action)
    .with({ type: 'TICK' }, ({ deltaSeconds }) => tick(state, deltaSeconds))
    .with({ type: 'MOVE_LEFT_START' }, () => withInput(state, { isLeft: true }))
    .with({ type: 'MOVE_LEFT_STOP' }, () => withInput(state, { isLeft: false }))
    .with({ type: 'MOVE_RIGHT_START' }, () =>
      withInput(state, { isRight: true }),
    )
    .with({ type: 'MOVE_RIGHT_STOP' }, () =>
      withInput(state, { isRight: false }),
    )
    .with({ type: 'JUMP_START' }, () => startJump(state))
    .with({ type: 'JUMP_STOP' }, () => withInput(state, { isJump: false }))
    .with({ type: 'INTERACT' }, () => interact(state))
    .with({ type: 'CHOOSE_ITEM' }, ({ index }) => chooseItem(state, index))
    .with({ type: 'CLOSE' }, () => close(state))
    .with({ type: 'RESPAWN' }, () => respawn(state))
    .with({ type: 'LOAD_LEVEL' }, ({ level, levelIndex }) =>
      loadLevel(state, level, levelIndex),
    )
    .exhaustive();
