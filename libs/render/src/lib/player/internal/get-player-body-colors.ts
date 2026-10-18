import type { Player } from '@mander/model';
import { match } from 'ts-pattern';
import { HURT_PLAYER_COLORS, PLAYER_COLORS } from '../consts';
import type { PlayerColors } from '../types/player-colors';
import { isPlayerFlashing } from './is-player-flashing';

export const getPlayerBodyColors = (player: Player): PlayerColors =>
  match(isPlayerFlashing(player))
    .with(true, () => HURT_PLAYER_COLORS)
    .otherwise(() => PLAYER_COLORS);
