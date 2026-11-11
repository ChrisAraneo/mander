import { type FallingSpike, type Level, type Player } from '@mander/model';
import { computeVerticalMove } from '../../collision/compute-vertical-move';
import {
  FALLING_SPIKE_HEIGHT,
  FALLING_SPIKE_INSET_X,
  FALLING_SPIKE_WIDTH,
} from '../consts';

export const isFallingSpikePathBlocked = (
  level: Level,
  spike: FallingSpike,
  player: Player,
): boolean =>
  computeVerticalMove(
    level,
    spike.position.x + FALLING_SPIKE_INSET_X,
    spike.position.y,
    FALLING_SPIKE_WIDTH,
    FALLING_SPIKE_HEIGHT,
    Math.max(player.position.y - spike.position.y - FALLING_SPIKE_HEIGHT, 0),
  ).isBlocked;
