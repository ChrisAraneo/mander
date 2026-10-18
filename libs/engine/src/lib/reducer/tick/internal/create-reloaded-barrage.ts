import type { GameState } from '../../../types/game-state';
import { createCannons } from '../../cannon/create-cannons';
import type { Barrage } from '../../cannon/types/barrage';

export const createReloadedBarrage = (level: GameState['level']): Barrage => ({
  cannons: createCannons(level),
  cannonballs: [],
});
