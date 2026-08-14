import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import type { Action } from '../actions/actions';
import type { GameState } from '../state/types/game-state';
import { chooseItem } from './choose-item/choose-item';
import { close } from './close/close';
import { interact } from './interact/interact';
import { jumpStart } from './jump-start/jump-start';
import { jumpStop } from './jump-stop/jump-stop';
import { loadLevel } from './load-level/load-level';
import { moveLeftStart } from './move-left-start/move-left-start';
import { moveLeftStop } from './move-left-stop/move-left-stop';
import { moveRightStart } from './move-right-start/move-right-start';
import { moveRightStop } from './move-right-stop/move-right-stop';
import { respawn } from './respawn/respawn';
import { restart } from './restart/restart';
import { tick } from './tick/tick';
import { useStar } from './use-star/use-star';

export const reduce = (state: GameState, action: Action): GameState =>
  chain(performance.now())
    .thru((startTime) => ({
      startTime,
      newState: match(action)
        .with({ type: 'TICK' }, ({ deltaSeconds }) => tick(state, deltaSeconds))
        .with({ type: 'MOVE_LEFT_START' }, () => moveLeftStart(state))
        .with({ type: 'MOVE_LEFT_STOP' }, () => moveLeftStop(state))
        .with({ type: 'MOVE_RIGHT_START' }, () => moveRightStart(state))
        .with({ type: 'MOVE_RIGHT_STOP' }, () => moveRightStop(state))
        .with({ type: 'JUMP_START' }, () => jumpStart(state))
        .with({ type: 'JUMP_STOP' }, () => jumpStop(state))
        .with({ type: 'INTERACT' }, () => interact(state))
        .with({ type: 'CHOOSE_ITEM' }, ({ index }) => chooseItem(state, index))
        .with({ type: 'USE_STAR' }, () => useStar(state))
        .with({ type: 'CLOSE' }, () => close(state))
        .with({ type: 'RESPAWN' }, () => respawn(state))
        .with({ type: 'LOAD_LEVEL' }, ({ level, levelIndex }) =>
          loadLevel(state, level, levelIndex),
        )
        .with({ type: 'RESTART' }, ({ level }) => restart(level))
        .exhaustive(),
    }))
    .thru(({ startTime, newState }) => ({
      ...newState,
      updateTime: performance.now() - startTime,
    }))
    .value();
