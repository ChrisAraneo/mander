import {
  type FallingSpike,
  type Level,
  MAX_TICK_SECONDS,
  type Player,
} from '@mander/model';
import { isFallingSpikeReleased } from './is-falling-spike-released';
import type { FallingSpikeRelease } from './types/falling-spike-release';

export const computeFallingSpikeRelease = ({
  level,
  spike,
  player,
  elapsedSeconds,
}: {
  level: Level;
  spike: FallingSpike;
  player: Player;
  elapsedSeconds: number;
}): FallingSpikeRelease => ({
  level,
  spike,
  deltaSeconds: Math.min(elapsedSeconds, MAX_TICK_SECONDS),
  isReleased: isFallingSpikeReleased(level, spike, player),
});
