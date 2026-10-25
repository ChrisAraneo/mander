import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import {
  HURT_PLAYER_COLORS,
  INVINCIBLE_HURT_PLAYER_COLORS,
  INVINCIBLE_PLAYER_COLORS,
  PLAYER_COLORS,
} from '../consts';
import type { PlayerColors } from '../types/player-colors';
import { isPlayerFlashing } from './is-player-flashing';
import { isPlayerInvincible } from './is-player-invincible';

export const getPlayerBodyColors = (player: Player): PlayerColors =>
  match({
    isFlashing: isPlayerFlashing(player),
    isInvincible: isPlayerInvincible(player),
  })
    .with(
      { isFlashing: true, isInvincible: true },
      () => INVINCIBLE_HURT_PLAYER_COLORS,
    )
    .with({ isFlashing: true }, () => HURT_PLAYER_COLORS)
    .with({ isInvincible: true }, () => INVINCIBLE_PLAYER_COLORS)
    .otherwise(() => PLAYER_COLORS);
