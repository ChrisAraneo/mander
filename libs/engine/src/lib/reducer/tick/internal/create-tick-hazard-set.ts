import type {
  Bullet,
  Enemy,
  FallingSpike,
  Fireball,
  Snowball,
} from '@mander/model';
import type { Barrage } from '../../cannon/types/barrage';
import type { TickHazardSet } from './types/tick-hazard-set';

export const createTickHazardSet = (
  steppedEnemies: Enemy[],
  { cannons, cannonballs }: Barrage,
  snowballs: Snowball[],
  fallingSpikes: FallingSpike[],
  fireballs: Fireball[],
  flyingBullets: Bullet[],
): TickHazardSet => ({
  steppedEnemies,
  cannons,
  flying: cannonballs,
  snowballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
});
