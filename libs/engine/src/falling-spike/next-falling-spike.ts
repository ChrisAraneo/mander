import type { FallingSpike, Level, Player } from '@mander/model';
import { pipe } from 'remeda';
import { computeFallingSpikeRelease } from './internal/compute-falling-spike-release';
import { tryGetReleasedFallingSpike } from './internal/try-get-released-falling-spike';

export const nextFallingSpike = (
  level: Level,
  spike: FallingSpike,
  player: Player,
  elapsedSeconds: number,
): FallingSpike | undefined =>
  pipe(
    { level, spike, player, elapsedSeconds },
    computeFallingSpikeRelease,
    tryGetReleasedFallingSpike,
  );
