import type { Enemy, Fireball } from '@mander/model';
import { some } from 'lodash-es';
import { isAlive } from '../../player/is-alive';
import { computeSweptCentres } from './compute-swept-centres';
import { isFireballHittingEnemy } from './is-fireball-hitting-enemy';

export const isEnemyBurned = (
  fireballs: Fireball[],
  enemy: Enemy,
  elapsedSeconds: number,
): boolean =>
  isAlive(enemy) &&
  some(fireballs, (fireball) =>
    some(computeSweptCentres(fireball, elapsedSeconds), (centre) =>
      isFireballHittingEnemy(centre, enemy),
    ),
  );
