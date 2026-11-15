import { FIXED_STEP_MS } from '@mander/model';
import type { Replay } from '../recorder/types/replay';

export const computeReplayDuration = (replay: Replay): number =>
  replay.steps * FIXED_STEP_MS;
