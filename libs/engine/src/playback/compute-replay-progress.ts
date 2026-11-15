import { clamp } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Replay } from '../recorder/types/replay';
import type { ReplayPlayback } from './types/replay-playback';

const NO_STEPS = 0;

const NO_PROGRESS = 0;

const FULL_PROGRESS = 1;

export const computeReplayProgress = (
  replay: Replay,
  playback: ReplayPlayback,
): number =>
  match(replay.steps)
    .with(NO_STEPS, () => FULL_PROGRESS)
    .otherwise((steps) =>
      clamp(playback.step / steps, NO_PROGRESS, FULL_PROGRESS),
    );
