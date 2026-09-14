import type { GameState } from './types/game-state';
import type { InputState } from './types/input-state';

export const patchInput = (
  state: GameState,
  patch: Partial<InputState>,
): GameState => ({ ...state, input: { ...state.input, ...patch } });
