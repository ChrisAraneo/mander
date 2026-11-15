import type { Player } from '@mander/model';
import type { Salvo } from '../../../enemy/types/salvo';
import type { GameState } from '../../../state/types/game-state';

export interface MovedSalvo {
  state: GameState;
  player: Player;
  deltaSeconds: number;
  salvo: Salvo;
}
