import type { Player } from '@mander/model';
import type { GameState } from '../../../types/game-state';
import { startPlayerDeath } from '../../player/start-player-death';
import { patchLostHeart } from './patch-lost-heart';
import type { TickOutcome } from './types/tick-outcome';

export const createGameOverOutcome = (
  state: GameState,
  player: Player,
): TickOutcome => ({
  player: {
    ...startPlayerDeath(player),
    hearts: patchLostHeart(player.hearts),
  },
  deaths: state.deaths + 1,
  status: 'GAME_OVER',
});
