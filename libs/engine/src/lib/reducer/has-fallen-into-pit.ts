import { type Level, type Player, TILE_SIZE } from '@mander/model';

export const hasFallenIntoPit = (level: Level, player: Player): boolean =>
  player.position.y > (level.height + 3) * TILE_SIZE;
