import type { Item } from '@mander/model';
import { pipe } from 'remeda';
import type { GameState } from '../../state/types/game-state';
import { computeTakenItemVelocity } from './compute-taken-item-velocity';
import { patchTakenItemPlayer } from './patch-taken-item-player';
import { patchTakenItemState } from './patch-taken-item-state';

export const patchTakenItem = (state: GameState, item: Item): GameState =>
  pipe(
    { state, item },
    computeTakenItemVelocity,
    patchTakenItemPlayer,
    patchTakenItemState,
  );
