import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../actions';
import type { GameState } from '../state';
import { createEnemies, createPlayer } from '../state';
import { tick } from './tick';
import { withInput } from './with-input';

const startJump = (state: GameState): GameState =>
  match(state.input.isJump)
    .with(true, (): GameState => state)
    .otherwise(
      (): GameState => ({
        ...withInput(state, { isJump: true }),
        player: match(state.status)
          .with('PLAYING', () => ({ ...state.player, isJumpQueued: true }))
          .otherwise(() => state.player),
      }),
    );

const interact = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState =>
      match({ isNearChest: state.isNearChest, hasKey: state.hasKey })
        .with(
          { isNearChest: true, hasKey: true },
          (): GameState => ({ ...state, status: 'CHEST' }),
        )
        .otherwise(() =>
          match(state.isNearPortal)
            .with(true, (): GameState => ({ ...state, status: 'COMPLETE' }))
            .otherwise((): GameState => state),
        ),
    )
    .otherwise((): GameState => state);

const chooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => {
      const items = state.level.chestItems;
      return match(index >= 0 && index < items.length)
        .with(
          true,
          (): GameState => ({
            ...state,
            status: 'PLAYING',
            isChestOpened: true,
            isNearChest: false,
            inventory: concat(state.inventory, items[index]),
          }),
        )
        .otherwise((): GameState => state);
    })
    .otherwise((): GameState => state);

const close = (state: GameState): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => ({ ...state, status: 'PLAYING' }))
    .otherwise((): GameState => state);

const respawn = (state: GameState): GameState =>
  match(state.status)
    .with(
      'PLAYING',
      (): GameState => ({ ...state, player: createPlayer(state.level) }),
    )
    .otherwise((): GameState => state);

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
  status: 'PLAYING',
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
