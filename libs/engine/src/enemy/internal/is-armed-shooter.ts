import type { Enemy, Player } from '@mander/model';
import { isAlive } from '../../player/is-alive';
import { isEnemyShooter } from './is-enemy-shooter';
import { isPlayerInShooterRange } from './is-player-in-shooter-range';

export const isArmedShooter = (enemy: Enemy, player: Player): boolean =>
  isEnemyShooter(enemy) &&
  isAlive(enemy) &&
  isPlayerInShooterRange(enemy, player);
