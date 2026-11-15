import type { Level, Player } from '@mander/model';
import { computePlayerMoveSpeed } from './compute-player-move-speed';
import { computePlayerVelocityStep } from './compute-player-velocity-step';
import { computeRampedVelocityX } from './compute-ramped-velocity-x';

export const computePlayerVelocityX = (
  level: Level,
  player: Player,
  direction: number,
  deltaSeconds: number,
): number =>
  computeRampedVelocityX(
    player.velocity.x.current,
    direction * computePlayerMoveSpeed(level, player),
    computePlayerVelocityStep(level, player, deltaSeconds),
  );
