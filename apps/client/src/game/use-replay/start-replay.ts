import { getReplayDuration } from '@mander/engine';
import { tap } from 'lodash-es';
import { pipe } from 'remeda';
import { patchRef } from '../canvas';
import { createFixedPulses } from '../tick';
import { REPLAY_SPEEDS } from './consts';
import { createFirstReplayStep } from './internal/create-first-replay-step';
import { drawReplayStep } from './internal/draw-replay-step';
import { handleReplayPulse } from './internal/handle-replay-pulse';
import { patchReplayStep } from './internal/patch-replay-step';
import { toOriginReplay } from './internal/to-origin-replay';
import type { ReplaySession } from './types/replay-session';

const MS_PER_SECOND = 1000;

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
