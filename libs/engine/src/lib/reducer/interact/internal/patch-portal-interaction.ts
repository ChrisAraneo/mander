import { match } from 'ts-pattern';
import type { GameState } from '../../../types/game-state';
import { finishLevel } from './finish-level';

export const patchPortalInteraction = (state: GameState): GameState =>
  match(state.isNearPortal)
    .with(true, () => finishLevel(state))
    .otherwise(() => state);
