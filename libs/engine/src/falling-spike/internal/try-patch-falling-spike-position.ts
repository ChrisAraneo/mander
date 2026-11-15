import type { FallingSpike, Level } from '@mander/model';
import { pipe } from 'remeda';
import { computeFallingSpikeDrop } from './compute-falling-spike-drop';
import { computeFallingSpikeFall } from './compute-falling-spike-fall';
import { tryGetDroppedFallingSpike } from './try-get-dropped-falling-spike';

export const tryPatchFallingSpikePosition = (
  level: Level,
  spike: FallingSpike,
  deltaSeconds: number,
): FallingSpike | undefined =>
  pipe(
    { level, spike, deltaSeconds },
    computeFallingSpikeFall,
    computeFallingSpikeDrop,
    tryGetDroppedFallingSpike,
  );
