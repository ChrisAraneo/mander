import type { Bullet, Enemy } from '@mander/model';
import { find } from 'lodash-es';
import { isAlive } from '../../player/is-alive';
import { isHittingEnemy } from '../is-hitting-enemy';

export const findBulletVictim = (
  bullet: Bullet,
  enemies: Enemy[],
): Enemy | undefined =>
  find(enemies, (enemy) => isAlive(enemy) && isHittingEnemy(bullet, enemy));
