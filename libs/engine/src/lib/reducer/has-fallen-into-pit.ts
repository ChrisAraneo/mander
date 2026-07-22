import { type Level, TILE_SIZE } from '@mander/generator';

import type { Player } from '../state';

export function hasFallenIntoPit(level: Level, player: Player): boolean {
  return player.y > (level.height + 3) * TILE_SIZE;
}
