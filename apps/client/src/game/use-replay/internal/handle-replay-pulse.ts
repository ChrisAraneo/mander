import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Pulse } from '../../tick';
import type { ReplaySession } from '../types/replay-session';
import { drawReplayStep } from './draw-replay-step';
import { nextReplayStep } from './next-replay-step';
import { patchReplayStep } from './patch-replay-step';

const { nonNullable } = P;

export const handleReplayPulse = (session: ReplaySession, pulse: Pulse): void =>
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
