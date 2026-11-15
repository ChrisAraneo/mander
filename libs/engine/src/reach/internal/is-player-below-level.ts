import { type Level, type Player, TILE_SIZE } from '@mander/model';

export const isPlayerBelowLevel = (level: Level, player: Player): boolean =>
  player.position.y > level.height * TILE_SIZE;
