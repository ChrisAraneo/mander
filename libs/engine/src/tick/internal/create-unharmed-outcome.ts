import type { Player } from '@mander/model';
import type { GameState } from '../../state/types/game-state';
import type { TickOutcome } from './types/tick-outcome';

export const createUnharmedOutcome = (
  state: GameState,
  player: Player,
): TickOutcome => ({
  player,
  deaths: state.deaths,
  status: 'PLAYING',
});
