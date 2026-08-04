import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Replay } from './replay';
import { replayDuration } from './replay-duration';
import type { ReplayPlayback } from './replay-playback';

export const replayProgress = (
  replay: Replay,
  playback: ReplayPlayback,
): number =>
  match(replayDuration(replay))
    .with(0, () => 1)
    .otherwise((duration) => clamp(playback.elapsedMs / duration, 0, 1));
