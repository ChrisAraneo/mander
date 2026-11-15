import { nextCannonballs } from '../../cannon/next-cannonballs';
import type { Barrage } from '../../cannon/types/barrage';
import type { GameState } from '../../state/types/game-state';

export const addMovedCannonballs = (
  { cannons, cannonballs }: Barrage,
  state: GameState,
  deltaSeconds: number,
): Barrage => ({
  cannons,
  cannonballs: [
    ...nextCannonballs(state.cannonballs, state.level, deltaSeconds),
    ...cannonballs,
  ],
});
