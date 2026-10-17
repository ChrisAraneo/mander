import type { Enemy } from '@mander/model';
import { isAlive } from '../../player/is-alive';
import { isEnemyBeartrap } from './is-enemy-beartrap';

export const isArmedBeartrap = (enemy: Enemy): boolean =>
  isEnemyBeartrap(enemy) && isAlive(enemy);
