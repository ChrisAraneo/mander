import { computeHorizontalMove } from '../../collision/compute-horizontal-move';
import type { AxisMove } from '../../collision/types/axis-move';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../consts';
import type { PlayerStepFall } from './types/player-step-fall';

export const computePlayerHorizontalMove = ({
  level,
  player,
  deltaSeconds,
  velocityX,
}: PlayerStepFall): AxisMove =>
  computeHorizontalMove(
    level,
    player.position.x,
    player.position.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    velocityX * deltaSeconds,
  );
