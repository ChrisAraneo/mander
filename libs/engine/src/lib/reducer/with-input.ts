import type { GameState, InputState } from '../state';

export function withInput(state: GameState, patch: Partial<InputState>): GameState {
  return { ...state, input: { ...state.input, ...patch } };
}
