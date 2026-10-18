import type { Player } from '@mander/model';
import type { Hitbox } from '../types/hitbox';
import {
  PLAYER_HEIGHT,
  PLAYER_HITBOX_INSET_BOTTOM,
  PLAYER_HITBOX_INSET_TOP,
  PLAYER_HITBOX_INSET_X,
  PLAYER_WIDTH,
} from './consts';

export const computePlayerHitbox = (player: Player): Hitbox => ({
  left: player.position.x + PLAYER_HITBOX_INSET_X,
  right: player.position.x + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X,
  top: player.position.y + PLAYER_HITBOX_INSET_TOP,
  bottom: player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM,
});
