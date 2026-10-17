import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
} from '@mander/model';

export interface TickHazardSet {
  steppedEnemies: Enemy[];
  cannons: Cannon[];
  flying: Cannonball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  playerFireballs: Fireball[];
  flyingBullets: Bullet[];
}
