import { getReplayProgress, isReplayFinished } from '@mander/engine';
import { FIXED_STEP_SECONDS } from '@mander/model';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../../canvas';
import type { ReplaySession } from '../types/replay-session';
import type { ReplayStep } from './types/replay-step';

export const patchReplayStep = (
  session: ReplaySession,
  step: ReplayStep,
): ReplayStep =>
  pipe(
    step,
    (next) => tap(next, () => patchRef(session.frame, next.frame)),
    (next) => tap(next, () => patchRef(session.ghosts, next.ghosts)),
    (next) =>
      tap(next, () =>
        patchRef(
          session.progress,
          getReplayProgress(session.recording.value, next.frame.playback),
        ),
      ),
    (next) =>
      tap(next, () =>
        patchRef(
          session.elapsedSeconds,
          next.frame.playback.step * FIXED_STEP_SECONDS,
        ),
      ),
    (next) =>
      tap(next, () =>
        patchRef(
          session.isFinished,
          isReplayFinished(session.recording.value, next.frame.playback),
        ),
      ),
  );
