import { type FallingSpike, type Player } from '@mander/model';
import {
  FALLING_SPIKE_TRIGGER_DEPTH,
  FALLING_SPIKE_TRIGGER_RANGE,
} from '../consts';
import { computeFallingSpikeDepth } from './compute-falling-spike-depth';
import { computeFallingSpikeGap } from './compute-falling-spike-gap';

export const isPlayerInFallingSpikeRange = (
  spike: FallingSpike,
  player: Player,
): boolean =>
  Math.abs(computeFallingSpikeGap(spike, player)) <=
    FALLING_SPIKE_TRIGGER_RANGE &&
  computeFallingSpikeDepth(spike, player) > 0 &&
  computeFallingSpikeDepth(spike, player) <= FALLING_SPIKE_TRIGGER_DEPTH;
