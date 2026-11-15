import type { GameState } from '../../state/types/game-state';
import { patchShieldedPlayer } from './patch-shielded-player';

export const patchSpentStar = (state: GameState): GameState => ({
  ...state,
  stars: state.stars - 1,
  player: patchShieldedPlayer(state.player),
});
