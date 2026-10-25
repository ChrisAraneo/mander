import {
  type FallingSpike,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
} from '@mander/model';
import { match } from 'ts-pattern';
import { isPlayerInFallingSpikeRange } from './internal/is-player-in-falling-spike-range';
import { tryPatchFallingSpikePosition } from './internal/try-patch-falling-spike-position';

export const nextFallingSpike = (
  level: Level,
  spike: FallingSpike,
  player: Player,
  elapsedSeconds: number,
): FallingSpike | null =>
  match(spike.statuses.isFalling || isPlayerInFallingSpikeRange(spike, player))
    .with(true, (): FallingSpike | null =>
      tryPatchFallingSpikePosition(
        level,
        spike,
        Math.min(elapsedSeconds, MAX_TICK_SECONDS),
      ),
    )
    .otherwise((): FallingSpike | null => spike);
