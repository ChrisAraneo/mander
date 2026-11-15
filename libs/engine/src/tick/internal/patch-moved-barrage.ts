import type { Player } from '@mander/model';
import { nextCannons } from '../../cannon/next-cannons';
import type { Barrage } from '../../cannon/types/barrage';
import type { GameState } from '../../state/types/game-state';
import { addMovedCannonballs } from './add-moved-cannonballs';

export const patchMovedBarrage = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Barrage =>
  addMovedCannonballs(
    nextCannons(state.cannons, player, deltaSeconds),
    state,
    deltaSeconds,
  );
