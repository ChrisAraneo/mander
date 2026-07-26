import type { State } from '../types/state';

export const stopPainting = (state: State): void => {
  state.isPainting = false;
};
