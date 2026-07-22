import type { Rect } from '@mander/generator';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { Player } from '../state';

export function isIntersecting(player: Player, rect: Rect, padding: number): boolean {
  return (
    player.x - padding < rect.x + rect.width &&
    player.x + PLAYER_WIDTH + padding > rect.x &&
    player.y - padding < rect.y + rect.height &&
    player.y + PLAYER_HEIGHT + padding > rect.y
  );
}
