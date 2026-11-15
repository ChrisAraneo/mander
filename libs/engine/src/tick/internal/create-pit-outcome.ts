import type { Player } from '@mander/model';
import { startPlayerDeath } from '../../player/start-player-death';
import type { GameState } from '../../state/types/game-state';
import { patchLostHeart } from './patch-lost-heart';
import type { TickOutcome } from './types/tick-outcome';

export const createPitOutcome = (
  state: GameState,
  player: Player,
): TickOutcome => ({
  player: {
    ...startPlayerDeath(player),
    hearts: patchLostHeart(player.hearts),
  },
  deaths: state.deaths + 1,
  status: 'PLAYING',
});
