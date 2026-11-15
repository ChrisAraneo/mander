import { createCannons } from '../../cannon/create-cannons';
import type { Barrage } from '../../cannon/types/barrage';
import type { GameState } from '../../state/types/game-state';

export const createReloadedBarrage = (level: GameState['level']): Barrage => ({
  cannons: createCannons(level),
  cannonballs: [],
});
