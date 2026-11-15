import type { Enemy, Player } from '@mander/model';
import { isFalling } from '../player/is-falling';
import { isDroppingOntoHead } from './internal/is-dropping-onto-head';
import { isOverlappingHorizontally } from './internal/is-overlapping-horizontally';

export const isStompingEnemy = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
  deltaSeconds: number,
): boolean =>
  isFalling(player) &&
  isOverlappingHorizontally(enemy, player) &&
  isDroppingOntoHead(previousPlayer, player, enemy, deltaSeconds);
