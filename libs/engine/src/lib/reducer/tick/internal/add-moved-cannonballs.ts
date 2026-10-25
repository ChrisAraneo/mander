import type { GameState } from '../../../types/game-state';
import { nextCannonballs } from '../../cannon/next-cannonballs';
import type { Barrage } from '../../cannon/types/barrage';

export const addMovedCannonballs = (
  state: GameState,
  deltaSeconds: number,
  { cannons, cannonballs }: Barrage,
): Barrage => ({
  cannons,
  cannonballs: [
    ...nextCannonballs(state.level, state.cannonballs, deltaSeconds),
    ...cannonballs,
  ],
});
