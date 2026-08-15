import type { Player } from '@mander/model';

import type { GameStatus } from '../../../state/types/game-status';

export interface Outcome {
  player: Player;
  deaths: number;
  status: GameStatus;
}
