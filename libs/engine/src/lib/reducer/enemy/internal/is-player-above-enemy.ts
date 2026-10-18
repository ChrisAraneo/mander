import type { Enemy, Player } from '@mander/model';
import { PLAYER_HEIGHT } from '../../player/consts';

const OVERHEAD_TOLERANCE = 6;

export const isPlayerAboveEnemy = (enemy: Enemy, player: Player): boolean =>
  player.position.y + PLAYER_HEIGHT <= enemy.position.y + OVERHEAD_TOLERANCE;
