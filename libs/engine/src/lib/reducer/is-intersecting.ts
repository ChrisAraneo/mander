import type { Rect } from '../world';

import type { Player } from '../state';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';

export const isIntersecting = (
  player: Player,
  rect: Rect,
  padding: number,
): boolean =>
  player.position.x - padding < rect.x + rect.width &&
  player.position.x + PLAYER_WIDTH + padding > rect.x &&
  player.position.y - padding < rect.y + rect.height &&
  player.position.y + PLAYER_HEIGHT + padding > rect.y;
