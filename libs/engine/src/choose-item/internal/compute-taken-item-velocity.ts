import type { Item } from '@mander/model';
import { createBasePlayerVelocity } from '../../player/create-base-player-velocity';
import type { GameState } from '../../state/types/game-state';
import type { TakenItemVelocity } from './types/taken-item-velocity';

export const computeTakenItemVelocity = ({
  state,
  item,
}: {
  state: GameState;
  item: Item;
}): TakenItemVelocity => ({
  state,
  item,
  baseVelocity: createBasePlayerVelocity(),
});
