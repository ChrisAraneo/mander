import { type Level, type Player, TILE_SIZE } from '@mander/model';
import { PIT_DEPTH_TILES } from '../consts';

export const isPlayerInPit = (level: Level, player: Player): boolean =>
  player.position.y > (level.height + PIT_DEPTH_TILES) * TILE_SIZE;
