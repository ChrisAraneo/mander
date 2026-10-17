import { chain } from '@mander/utils';
import type { GameState } from '../../../types/game-state';
import { createPlayerFireballs } from '../../fireball/create-player-fireballs';

export const patchFlippedMoonMagnet = (state: GameState): GameState =>
  chain(!state.isMoonMagnetOn)
    .thru((isMoonMagnetOn): GameState => ({
      ...state,
      isMoonMagnetOn,
      playerFireballs: createPlayerFireballs(
        state.inventory,
        state.player,
        isMoonMagnetOn,
      ),
    }))
    .value();
