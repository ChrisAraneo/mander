import { reduce, times } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Replay } from '../recorder/types/replay';
import type { Clock } from '../types/clock';
import { patchPlaybackStep } from './internal/patch-playback-step';
import { isReplayFinished } from './is-replay-finished';
import type { ReplayPlayback } from './types/replay-playback';

export const nextPlayback = (
  replay: Replay,
  playback: ReplayPlayback,
  steps: number,
  now: Clock,
): ReplayPlayback =>
  reduce(
    times(Math.max(0, steps)),
    (current) =>
      match(isReplayFinished(replay, current))
        .with(true, () => current)
        .otherwise(() => patchPlaybackStep(replay, current, now)),
    playback,
  );
