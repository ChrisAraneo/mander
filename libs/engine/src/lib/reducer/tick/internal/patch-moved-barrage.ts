import { type Player } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { nextCannonballs } from '../../cannon/next-cannonballs';
import { nextCannons } from '../../cannon/next-cannons';
import type { Barrage } from '../../cannon/types/barrage';

const addMovedCannonballs = (
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
