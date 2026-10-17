import { reduce as fold, times } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Replay } from '../recorder/types/replay';
import { patchPlaybackStep } from './internal/patch-playback-step';
import { isReplayFinished } from './is-replay-finished';
import type { ReplayPlayback } from './types/replay-playback';

export const advancePlayback = (
  replay: Replay,
  playback: ReplayPlayback,
  steps: number,
): ReplayPlayback =>
  fold(
    times(Math.max(0, steps)),
    (current) =>
      match(isReplayFinished(replay, current))
        .with(true, () => current)
        .otherwise(() => patchPlaybackStep(replay, current)),
    playback,
  );
