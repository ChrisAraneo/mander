import {
  getReplayDuration,
  getReplayProgress,
  isReplayFinished,
} from '@mander/engine';
import { FIXED_STEP_SECONDS } from '@mander/model';
import { computeInterpolatedState } from '@mander/render';
import { noop, tap } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { patchRef } from '../canvas';
import { createFixedPulses, type Pulse } from '../tick';
import { REPLAY_SPEEDS } from './consts';
import { drawStageState } from './draw-stage-state';
import { createFirstReplayStep } from './internal/create-first-replay-step';
import { getGhostStates } from './internal/get-ghost-states';
import { nextReplayStep } from './internal/next-replay-step';
import { toOriginReplay } from './internal/to-origin-replay';
import type { ReplayStep } from './internal/types/replay-step';
import type { ReplaySession } from './types/replay-session';

const { nonNullable } = P;

const MS_PER_SECOND = 1000;

const patchReplayStep = (
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

const drawReplayStep = (session: ReplaySession, step: ReplayStep): void =>
  drawStageState(
    session.stage,
    computeInterpolatedState(
      step.frame.previous,
      step.frame.playback.state,
      step.alpha,
    ),
    getGhostStates(step.ghosts, step.alpha),
  );

const handleReplayPulse = (session: ReplaySession, pulse: Pulse): void =>
  match({
    frame: session.frame.value,
    isPaused: session.isPaused.value,
    isFinished: session.isFinished.value,
  })
    .with(
      { frame: nonNullable, isPaused: false, isFinished: false },
      ({ frame }) =>
        drawReplayStep(
          session,
          patchReplayStep(
            session,
            nextReplayStep(
              session.recording.value,
              frame,
              session.ghosts.value,
              pulse.steps * session.speed.value,
              pulse.alpha,
              () => performance.now(),
            ),
          ),
        ),
    )
    .otherwise(noop);

export const startReplay = (session: ReplaySession): ReplaySession =>
  pipe(
    session,
    (current) => tap(current, () => current.subscription.value?.unsubscribe()),
    (current) =>
      tap(current, () =>
        patchRef(current.recording, toOriginReplay(current.origin)),
      ),
    (current) =>
      tap(current, () =>
        patchRef(
          current.durationSeconds,
          getReplayDuration(current.recording.value) / MS_PER_SECOND,
        ),
      ),
    (current) => tap(current, () => patchRef(current.speed, REPLAY_SPEEDS[0])),
    (current) => tap(current, () => patchRef(current.isPaused, false)),
    (current) => tap(current, () => patchRef(current.isActive, true)),
    (current) =>
      tap(current, () =>
        drawReplayStep(
          current,
          patchReplayStep(current, createFirstReplayStep(current.stage)),
        ),
      ),
    (current) =>
      tap(current, () =>
        patchRef(
          current.subscription,
          createFixedPulses(current.stage.frames).subscribe((pulse) =>
            handleReplayPulse(current, pulse),
          ),
        ),
      ),
  );
