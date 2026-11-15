import type { Player } from '@mander/model';
import type { GameStatus } from '../../../state/types/game-status';

export interface TickOutcome {
  player: Player;
  deaths: number;
  status: GameStatus;
}
