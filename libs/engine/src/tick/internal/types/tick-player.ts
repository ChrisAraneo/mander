import type { Player } from '@mander/model';
import type { GameState } from '../../../state/types/game-state';

export interface TickPlayer {
  state: GameState;
  deltaSeconds: number;
  moved: Player;
  hasRespawned: boolean;
  isPlayerAlive: boolean;
}
