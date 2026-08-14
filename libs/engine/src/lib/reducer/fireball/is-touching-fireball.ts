import type { Fireball, Player } from '@mander/model';

import {
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from '../player/consts';
import { FIREBALL_HITBOX_INSET, FIREBALL_SIZE } from './consts';
import { fireballPosition } from './fireball-position';

export const isTouchingFireball = (
  player: Player,
  fireball: Fireball,
): boolean => {
  const playerLeft = player.position.x + PLAYER_HITBOX_INSET_X;
  const playerRight = player.position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X;
  const playerTop = player.position.y + PLAYER_HITBOX_INSET_TOP;
  const playerBottom =
    player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;

  const centre = fireballPosition(fireball);
  const reach = FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET;

  return (
    playerLeft < centre.x + reach &&
    playerRight > centre.x - reach &&
    playerTop < centre.y + reach &&
    playerBottom > centre.y - reach
  );
};
