import { match } from 'ts-pattern';
import type { GameState } from '../../../types/game-state';
import { patchPortalInteraction } from './patch-portal-interaction';

export const patchPlayingInteraction = (state: GameState): GameState =>
  match({ isNearChest: state.isNearChest, hasKey: state.hasKey })
    .with({ isNearChest: true, hasKey: true }, (): GameState => ({
      ...state,
      status: 'CHEST',
    }))
    .otherwise(() => patchPortalInteraction(state));
