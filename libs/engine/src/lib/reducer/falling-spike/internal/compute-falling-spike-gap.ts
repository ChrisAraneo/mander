import { type FallingSpike, type Player, TILE_SIZE } from '@mander/model';
import { PLAYER_WIDTH } from '../../player/consts';

export const computeFallingSpikeGap = (
  spike: FallingSpike,
  player: Player,
): number =>
  player.position.x + PLAYER_WIDTH / 2 - (spike.position.x + TILE_SIZE / 2);
