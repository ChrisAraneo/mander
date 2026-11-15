import type { Level, Player } from '@mander/model';
import { computePlayerAccelerationSeconds } from './compute-player-acceleration-seconds';
import { computePlayerMoveSpeed } from './compute-player-move-speed';

export const computePlayerVelocityStep = (
  level: Level,
  player: Player,
  deltaSeconds: number,
): number =>
  (computePlayerMoveSpeed(level, player) /
    computePlayerAccelerationSeconds(level, player)) *
  deltaSeconds;
