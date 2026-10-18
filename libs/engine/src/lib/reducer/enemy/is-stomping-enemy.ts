import { type Enemy, type Player } from '@mander/model';
import { isDroppingOntoHead } from './internal/is-dropping-onto-head';
import { isOverlappingHorizontally } from './internal/is-overlapping-horizontally';

export const isStompingEnemy = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
  deltaSeconds: number,
): boolean =>
  player.velocity.y.current > 0 &&
  isOverlappingHorizontally(player, enemy) &&
  isDroppingOntoHead(previousPlayer, player, enemy, deltaSeconds);
