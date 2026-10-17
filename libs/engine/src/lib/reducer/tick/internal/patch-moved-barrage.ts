import type { Player } from '@mander/model';
import { chain } from '@mander/utils';
import type { GameState } from '../../../types/game-state';
import { advanceCannonballs } from '../../cannon/advance-cannonballs';
import { advanceCannons } from '../../cannon/advance-cannons';
import type { Barrage } from '../../cannon/types/barrage';

export const patchMovedBarrage = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Barrage =>
  chain(advanceCannons(state.cannons, player, deltaSeconds))
    .thru((fired): Barrage => ({
      cannons: fired.cannons,
      cannonballs: [
        ...advanceCannonballs(state.level, state.cannonballs, deltaSeconds),
        ...fired.cannonballs,
      ],
    }))
    .value();
