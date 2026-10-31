import type {
  Bullet,
  Cannon,
  Cannonball,
  Enemy,
  FallingSpike,
  Fireball,
  Snowball,
} from '@mander/model';

export interface TickHazardSet {
  steppedEnemies: Enemy[];
  cannons: Cannon[];
  flying: Cannonball[];
  snowballs: Snowball[];
  fallingSpikes: FallingSpike[];
  fireballs: Fireball[];
  flyingBullets: Bullet[];
}
