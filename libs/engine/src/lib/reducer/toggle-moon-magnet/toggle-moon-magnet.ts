import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import type { GameState } from '../../state/types/game-state';
import { createPlayerFireballs } from '../fireball/create-player-fireballs';
import { hasMoonMagnet } from './has-moon-magnet';

const flipMoonMagnet = (state: GameState): GameState =>
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

/**
 * The moons are passive, so the only way to call them off is this toggle. It
 * does nothing without the item: there is nothing to suspend, and a run that
 * never owned a Moon Magnet must not drift from its replay.
 */
export const toggleMoonMagnet = (state: GameState): GameState =>
  match({
    status: state.status,
    isOwned: hasMoonMagnet(state.inventory),
  })
    .with({ status: 'PLAYING', isOwned: true }, (): GameState =>
      flipMoonMagnet(state),
    )
    .otherwise((): GameState => state);
