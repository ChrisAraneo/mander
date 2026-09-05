import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Replay } from '../recorder/types/replay';
import type { ReplayPlayback } from './types/replay-playback';

export const replayProgress = (
  replay: Replay,
  playback: ReplayPlayback,
): number =>
  match(replay.steps)
    .with(0, () => 1)
    .otherwise((steps) => clamp(playback.step / steps, 0, 1));
