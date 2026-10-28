import type { Enemy } from './enemy';

export interface FastEnemy extends Enemy {
  kind: 'FAST';
}
