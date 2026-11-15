import type { Player } from '@mander/model';
import type { Blizzard } from '../../../enemy/types/blizzard';
import type { Salvo } from '../../../enemy/types/salvo';
import type { GameState } from '../../../state/types/game-state';

export interface MovedBlizzard {
  state: GameState;
  player: Player;
  deltaSeconds: number;
  salvo: Salvo;
  blizzard: Blizzard;
}
