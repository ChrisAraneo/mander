import type { Cannonball, Player } from '@mander/model';

import {
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from '../player/consts';
import { CANNONBALL_HITBOX_INSET, CANNONBALL_SIZE } from './consts';

export const isTouchingCannonball = (
  player: Player,
  cannonball: Cannonball,
): boolean => {
  const playerLeft = player.position.x + PLAYER_HITBOX_INSET_X;
  const playerRight = player.position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X;
  const playerTop = player.position.y + PLAYER_HITBOX_INSET_TOP;
  const playerBottom =
    player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;

  const ballLeft = cannonball.position.x + CANNONBALL_HITBOX_INSET;
  const ballRight =
    cannonball.position.x + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET;
  const ballTop = cannonball.position.y + CANNONBALL_HITBOX_INSET;
  const ballBottom =
    cannonball.position.y + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET;

  return (
    playerLeft < ballRight &&
    playerRight > ballLeft &&
    playerTop < ballBottom &&
    playerBottom > ballTop
  );
};
