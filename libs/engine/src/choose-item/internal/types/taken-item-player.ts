import type { Item, Player } from '@mander/model';
import type { GameState } from '../../../state/types/game-state';

export interface TakenItemPlayer {
  state: GameState;
  item: Item;
  player: Player;
}
