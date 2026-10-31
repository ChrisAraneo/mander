import type { Enemy } from './enemy';

export interface FreezingEnemy extends Enemy {
  kind: 'FREEZING';
}
