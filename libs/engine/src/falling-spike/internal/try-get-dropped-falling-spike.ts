import type { FallingSpike } from '@mander/model';
import { match } from 'ts-pattern';
import { createDroppedFallingSpike } from './create-dropped-falling-spike';
import { tryGetFallingSpikeInLevel } from './try-get-falling-spike-in-level';
import type { FallingSpikeDrop } from './types/falling-spike-drop';

export const tryGetDroppedFallingSpike = ({
  level,
  spike,
  velocityY,
  vertical,
}: FallingSpikeDrop): FallingSpike | undefined =>
  match(vertical.isBlocked)
    .with(true, (): FallingSpike | undefined => undefined)
    .otherwise((): FallingSpike | undefined =>
      tryGetFallingSpikeInLevel(
        level,
        createDroppedFallingSpike(spike, velocityY, vertical.position),
      ),
    );
