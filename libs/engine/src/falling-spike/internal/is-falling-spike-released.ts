import type { FallingSpike, Level, Player } from '@mander/model';
import { isFallingSpikePathBlocked } from './is-falling-spike-path-blocked';
import { isPlayerInFallingSpikeRange } from './is-player-in-falling-spike-range';

export const isFallingSpikeReleased = (
  level: Level,
  spike: FallingSpike,
  player: Player,
): boolean =>
  spike.statuses.isFalling ||
  (isPlayerInFallingSpikeRange(spike, player) &&
    !isFallingSpikePathBlocked(level, spike, player));
