import type { FallingSpike } from '@mander/model';
import { match } from 'ts-pattern';
import { tryPatchFallingSpikePosition } from './try-patch-falling-spike-position';
import type { FallingSpikeRelease } from './types/falling-spike-release';

export const tryGetReleasedFallingSpike = ({
  level,
  spike,
  deltaSeconds,
  isReleased,
}: FallingSpikeRelease): FallingSpike | undefined =>
  match(isReleased)
    .with(true, (): FallingSpike | undefined =>
      tryPatchFallingSpikePosition(level, spike, deltaSeconds),
    )
    .otherwise((): FallingSpike | undefined => spike);
