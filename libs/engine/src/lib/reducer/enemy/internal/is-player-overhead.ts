import { type Enemy, type Player } from '@mander/model';
import { isAlive } from '../../player/is-alive';
import { isPlayerAboveEnemy } from './is-player-above-enemy';
import { isPlayerNearEnemy } from './is-player-near-enemy';

export const isPlayerOverhead = (enemy: Enemy, player: Player): boolean =>
  isAlive(player) &&
  isPlayerNearEnemy(enemy, player) &&
  isPlayerAboveEnemy(enemy, player);
