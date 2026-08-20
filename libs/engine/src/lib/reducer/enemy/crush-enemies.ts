import type { Enemy } from '@mander/model';
import { filter, map, some } from 'lodash-es';

import { isAlive } from '../player/is-alive';
import { enemiesOverlap } from './enemies-overlap';
import { killEnemy } from './kill-enemy';

const isTrap = (enemy: Enemy): boolean => enemy.kind === 'BEARTRAP';

const isArmedTrap = (enemy: Enemy): boolean => isTrap(enemy) && isAlive(enemy);

const isCaught = (traps: Enemy[], prey: Enemy): boolean =>
  isAlive(prey) &&
  !isTrap(prey) &&
  some(traps, (trap) => enemiesOverlap(trap, prey));

export const crushEnemies = (enemies: Enemy[]): Enemy[] => {
  const traps = filter(enemies, isArmedTrap);

  return map(enemies, (enemy) =>
    isCaught(traps, enemy) ? killEnemy(enemy) : enemy,
  );
};
