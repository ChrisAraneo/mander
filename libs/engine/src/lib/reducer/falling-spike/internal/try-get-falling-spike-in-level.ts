import type { FallingSpike, Level } from '@mander/model';
import { match } from 'ts-pattern';
import { isFallingSpikeOutOfLevel } from './is-falling-spike-out-of-level';

export const tryGetFallingSpikeInLevel = (
  level: Level,
  spike: FallingSpike,
): FallingSpike | null =>
  match(isFallingSpikeOutOfLevel(level, spike))
    .with(true, (): FallingSpike | null => null)
    .otherwise((): FallingSpike | null => spike);
