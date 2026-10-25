import type { Enemy } from './enemy';

export interface HoppingEnemy extends Enemy {
  kind: 'HOPPING';
}
