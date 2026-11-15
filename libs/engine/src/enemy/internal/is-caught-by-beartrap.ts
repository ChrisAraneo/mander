import type { Enemy } from '@mander/model';
import { some } from 'lodash-es';
import { isAlive } from '../../player/is-alive';
import { isOverlappingEnemy } from '../is-overlapping-enemy';
import { isEnemyBeartrap } from './is-enemy-beartrap';

export const isCaughtByBeartrap = (traps: Enemy[], prey: Enemy): boolean =>
  isAlive(prey) &&
  !isEnemyBeartrap(prey) &&
  some(traps, (trap) => isOverlappingEnemy(trap, prey));
