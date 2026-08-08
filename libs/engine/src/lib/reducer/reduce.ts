import { findDiamondTiles, type Item } from '@mander/model';
import { chain } from '@mander/utils';
import { concat } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Action } from '../actions/actions';
import { createEnemies } from './enemy/create-enemies';
import { capabilitiesFor } from './player/capabilities-for';
import { createPlayer } from './player/create-player';
import { withCapabilities } from './player/with-capabilities';
import { levelScore } from './score/level-score';
import { scoreGain } from './score/score-gain';
import { createInitialState } from '../state/create-initial-state';
import type { GameState } from '../state/game-state';
import { withInput } from '../state/with-input';
import { tick } from './tick';

const heartGain = (item: Item): number =>
  match(item.effect)
    .with({ kind: 'HEART' }, (effect) => effect.amount)
    .otherwise(() => 0);

const startJump = (state: GameState): GameState =>
  match(state.input.isJump)
    .with(true, (): GameState => state)
    .otherwise((): GameState => ({
      ...withInput(state, { isJump: true }),
      player: match({
        status: state.status,
        death: state.player.timers.death,
      })
        .with({ status: 'PLAYING', death: null }, () => ({
          ...state.player,
          statuses: { ...state.player.statuses, isJumpQueued: true },
        }))
        .otherwise(() => state.player),
    }));

const withItem = (state: GameState, item: Item): GameState => {
  const inventory = concat(state.inventory, item);

  return {
    ...state,
    status: 'PLAYING',
    isChestOpened: true,
    isNearChest: false,
    inventory,
    score: state.score + scoreGain(item),
    player: withCapabilities(
      {
        ...state.player,
        hearts: {
          ...state.player.hearts,
          value: state.player.hearts.value + heartGain(item),
        },
      },
      capabilitiesFor(),
    ),
  };
};

const chooseItem = (state: GameState, index: number): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => {
      const items = state.level.chestItems;
      return match(index >= 0 && index < items.length)
        .with(true, (): GameState => withItem(state, items[index]))
        .otherwise((): GameState => state);
    })
    .otherwise((): GameState => state);

const complete = (state: GameState): GameState => ({
  ...state,
  status: 'COMPLETE',
  score: state.score + levelScore(state.time),
  levelTimes: concat(state.levelTimes, state.time),
});

const interact = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState =>
      match({ isNearChest: state.isNearChest, hasKey: state.hasKey })
        .with({ isNearChest: true, hasKey: true }, (): GameState => ({
          ...state,
          status: 'CHEST',
        }))
        .otherwise(() =>
          match(state.isNearPortal)
            .with(true, (): GameState => complete(state))
            .otherwise((): GameState => state),
        ),
    )
    .with('CHEST', (): GameState => chooseItem(state, 0))
    .otherwise((): GameState => state);

const close = (state: GameState): GameState =>
  match(state.status)
    .with('CHEST', (): GameState => ({ ...state, status: 'PLAYING' }))
    .otherwise((): GameState => state);

const respawn = (state: GameState): GameState =>
  match(state.status)
    .with('PLAYING', (): GameState => ({
      ...state,
      player: createPlayer(state.level, state.player),
      enemies: createEnemies(state.level),
    }))
    .otherwise((): GameState => state);

const loadLevel = (
  state: GameState,
  level: GameState['level'],
  levelIndex: number,
): GameState => ({
  ...state,
  level,
  levelIndex,
  player: createPlayer(level, state.player),
  enemies: createEnemies(level),
  diamonds: findDiamondTiles(level),
  status: 'PLAYING',
  hasKey: false,
  isChestOpened: false,
  isNearChest: false,
  isNearPortal: false,
  time: 0,
});

export const reduce = (state: GameState, action: Action): GameState =>
  chain(performance.now())
    .thru((startTime) => ({
      startTime,
      newState: match(action)
        .with({ type: 'TICK' }, ({ deltaSeconds }) => tick(state, deltaSeconds))
        .with({ type: 'MOVE_LEFT_START' }, () =>
          withInput(state, { isLeft: true }),
        )
        .with({ type: 'MOVE_LEFT_STOP' }, () =>
          withInput(state, { isLeft: false }),
        )
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
        .with({ type: 'RESTART' }, ({ level }) =>
          createInitialState(level, 0, []),
        )
        .exhaustive(),
    }))
    .thru(({ startTime, newState }) => ({
      ...newState,
      updateTime: performance.now() - startTime,
    }))
    .value();