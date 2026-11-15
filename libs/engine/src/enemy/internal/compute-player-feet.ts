import type { Player } from '@mander/model';
import { PLAYER_HEIGHT, PLAYER_HITBOX_INSET_BOTTOM } from '../../player/consts';

export const computePlayerFeet = (player: Player): number =>
  player.position.y + PLAYER_HEIGHT - PLAYER_HITBOX_INSET_BOTTOM;
