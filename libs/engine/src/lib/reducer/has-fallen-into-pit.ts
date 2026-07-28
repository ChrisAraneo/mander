import { type Level, TILE_SIZE } from '../world';

import type { Player } from '../state';

export const hasFallenIntoPit = (level: Level, player: Player): boolean =>
  player.position.y > (level.height + 3) * TILE_SIZE;
