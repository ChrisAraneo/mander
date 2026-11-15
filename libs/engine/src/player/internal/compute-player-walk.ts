import type { Level, Player } from '@mander/model';
import { computePlayerHorizontalMove } from './compute-player-horizontal-move';
import { createPlayerWalk } from './create-player-walk';
import type { PlayerWalk } from './types/player-walk';

export const computePlayerWalk = (
  level: Level,
  player: Player,
  deltaSeconds: number,
  velocityX: number,
): PlayerWalk =>
  createPlayerWalk(
    computePlayerHorizontalMove(level, player, deltaSeconds, velocityX),
    velocityX,
  );
