import type { Enemy } from './enemy';

export interface FlyingEnemy extends Enemy {
  kind: 'FLYING';
}
