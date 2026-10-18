import type { Player, Rectangle } from '@mander/model';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';

export const isIntersecting = (
  player: Player,
  rectangle: Rectangle,
  padding: number,
): boolean =>
  player.position.x - padding < rectangle.x + rectangle.width &&
  player.position.x + PLAYER_WIDTH + padding > rectangle.x &&
  player.position.y - padding < rectangle.y + rectangle.height &&
  player.position.y + PLAYER_HEIGHT + padding > rectangle.y;
