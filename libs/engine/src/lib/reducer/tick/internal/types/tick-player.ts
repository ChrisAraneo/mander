import type { Player } from '@mander/model';
import type { GameState } from '../../../../types/game-state';

export interface TickPlayer {
  state: GameState;
  deltaSeconds: number;
  moved: Player;
  hasRespawned: boolean;
  isPlayerAlive: boolean;
}
