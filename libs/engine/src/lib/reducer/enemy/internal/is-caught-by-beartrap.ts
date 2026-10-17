import type { Enemy } from '@mander/model';
import { some } from 'lodash-es';
import { isAlive } from '../../player/is-alive';
import { areEnemiesOverlapping } from '../are-enemies-overlapping';
import { isEnemyBeartrap } from './is-enemy-beartrap';

export const isCaughtByBeartrap = (traps: Enemy[], prey: Enemy): boolean =>
  isAlive(prey) &&
  !isEnemyBeartrap(prey) &&
  some(traps, (trap) => areEnemiesOverlapping(trap, prey));
