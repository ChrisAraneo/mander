import type { Level, Player } from '@mander/model';
import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';

export const computePlayerHorizontalMove = (
  level: Level,
  player: Player,
  deltaSeconds: number,
  velocityX: number,
): AxisMove =>
  computeHorizontalMove(
    level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    velocityX * deltaSeconds,
  );
