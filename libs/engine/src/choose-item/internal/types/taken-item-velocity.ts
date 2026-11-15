import type { Item, Player } from '@mander/model';
import type { GameState } from '../../../state/types/game-state';

export interface TakenItemVelocity {
  state: GameState;
  item: Item;
  baseVelocity: Player['velocity'];
}
