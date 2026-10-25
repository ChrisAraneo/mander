import { type Player } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { nextCannons } from '../../cannon/next-cannons';
import type { Barrage } from '../../cannon/types/barrage';
import { addMovedCannonballs } from './add-moved-cannonballs';

export const patchMovedBarrage = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Barrage =>
  addMovedCannonballs(
    state,
    deltaSeconds,
    nextCannons(state.cannons, player, deltaSeconds),
  );
