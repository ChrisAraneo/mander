import { type FallingSpike, type Player, TILE_SIZE } from '@mander/model';

import { PLAYER_WIDTH } from '../player/consts';
import { FALLING_SPIKE_TRIGGER_RANGE } from './consts';

export const isPlayerInRange = (spike: FallingSpike, player: Player): boolean =>
  Math.abs(
    player.position.x + PLAYER_WIDTH / 2 - (spike.position.x + TILE_SIZE / 2),
  ) <= FALLING_SPIKE_TRIGGER_RANGE;
