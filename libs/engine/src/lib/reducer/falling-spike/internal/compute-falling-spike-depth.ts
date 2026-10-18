import { type FallingSpike, type Player, TILE_SIZE } from '@mander/model';
import { PLAYER_HEIGHT } from '../../player/consts';

export const computeFallingSpikeDepth = (
  spike: FallingSpike,
  player: Player,
): number =>
  player.position.y + PLAYER_HEIGHT / 2 - (spike.position.y + TILE_SIZE / 2);
