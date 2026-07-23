import type { GameState, InputState } from '../state';

export const withInput = (
  state: GameState,
  patch: Partial<InputState>,
): GameState => ({ ...state, input: { ...state.input, ...patch } });
