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

export const toggleMoonMagnet = (state: GameState): GameState =>
  match({
    status: state.status,
    isOwned: hasMoonMagnet(state.inventory),
  })
    .with({ status: 'PLAYING', isOwned: true }, (): GameState =>
      flipMoonMagnet(state),
    )
    .otherwise((): GameState => state);
