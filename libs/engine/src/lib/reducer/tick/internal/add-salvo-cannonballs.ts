import type { Barrage } from '../../cannon/types/barrage';
import type { Salvo } from '../../enemy/types/salvo';

export const addSalvoCannonballs = (
  { cannons, cannonballs }: Barrage,
  salvo: Salvo,
): Barrage => ({
  cannons,
  cannonballs: [...cannonballs, ...salvo.cannonballs],
});
