import type { GameState } from './game-state';
import type { InputState } from './input-state';

export const withInput = (
  state: GameState,
  patch: Partial<InputState>,
): GameState => ({ ...state, input: { ...state.input, ...patch } });
