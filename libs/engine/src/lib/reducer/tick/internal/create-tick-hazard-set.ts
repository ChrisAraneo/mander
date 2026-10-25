import type { Bullet, Enemy, FallingSpike, Fireball } from '@mander/model';
import type { Barrage } from '../../cannon/types/barrage';
import type { TickHazardSet } from './types/tick-hazard-set';

export const createTickHazardSet = (
  steppedEnemies: Enemy[],
  { cannons, cannonballs }: Barrage,
  fallingSpikes: FallingSpike[],
  fireballs: Fireball[],
  flyingBullets: Bullet[],
): TickHazardSet => ({
  steppedEnemies,
  cannons,
  flying: cannonballs,
  fallingSpikes,
  fireballs,
  flyingBullets,
});
