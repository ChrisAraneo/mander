import { type Level, TILE_SIZE } from '@mander/generator';

import type { Player } from '../state';

export const hasFallenIntoPit = (level: Level, player: Player): boolean =>
  player.y > (level.height + 3) * TILE_SIZE;
