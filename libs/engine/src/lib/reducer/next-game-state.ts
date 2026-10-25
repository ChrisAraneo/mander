import { FIXED_STEP_SECONDS } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
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
import { handleRespawn } from './respawn/handle-respawn';
import { handleRestart } from './restart/handle-restart';
import { patchShot } from './shoot/patch-shot';
import { handleTick } from './tick/handle-tick';
import type { Action } from './types/action';
import type { Clock } from './types/clock';
import { patchStarUse } from './use-star/patch-star-use';

export const nextGameState = (
  state: GameState,
  action: Action,
  now: Clock,
): GameState =>
  pipe(
    now(),
    (startTime) => ({
      startTime,
      newState: match(action)
        .with({ type: 'TICK' }, () => handleTick(state, FIXED_STEP_SECONDS))
        .with({ type: 'MOVE_LEFT_START' }, () => handleMoveLeftStart(state))
        .with({ type: 'MOVE_LEFT_STOP' }, () => handleMoveLeftStop(state))
        .with({ type: 'MOVE_RIGHT_START' }, () => handleMoveRightStart(state))
        .with({ type: 'MOVE_RIGHT_STOP' }, () => handleMoveRightStop(state))
        .with({ type: 'JUMP_START' }, () => handleJumpStart(state))
        .with({ type: 'JUMP_STOP' }, () => handleJumpStop(state))
        .with({ type: 'INTERACT' }, () => handleInteract(state))
        .with({ type: 'CHOOSE_ITEM' }, ({ index }) =>
          handleChooseItem(state, index),
        )
        .with({ type: 'USE_STAR' }, () => patchStarUse(state))
        .with({ type: 'SHOOT' }, () => patchShot(state))
        .with({ type: 'CLOSE' }, () => handleClose(state))
        .with({ type: 'RESPAWN' }, () => handleRespawn(state))
        .with({ type: 'LOAD_LEVEL' }, ({ level, levelIndex }) =>
          handleLoadLevel(state, level, levelIndex),
        )
        .with({ type: 'RESTART' }, ({ level }) => handleRestart(level))
        .exhaustive(),
    }),
    ({ startTime, newState }) => ({
      ...newState,
      updateTime: now() - startTime,
    }),
  );
