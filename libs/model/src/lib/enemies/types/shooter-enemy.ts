import type { Enemy } from './enemy';

export interface ShooterEnemy extends Enemy {
  kind: 'SHOOTER';
}
