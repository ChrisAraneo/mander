import { size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { GameState } from '../../../types/game-state';
import { patchTakenItem } from './patch-taken-item';

export const patchChosenItem = (state: GameState, index: number): GameState =>
  match(index >= 0 && index < size(state.level.chestItems))
    .with(true, () => patchTakenItem(state, state.level.chestItems[index]))
    .otherwise(() => state);
