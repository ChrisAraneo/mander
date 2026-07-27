import type { State } from '../types/state';
import { fillGroundRow } from '../grid/fill-ground-row';
import { refreshState } from '../state/refresh-state';

export const fillGround = (state: State): void => {
  state.grid = fillGroundRow(state.grid);
  refreshState(state);
};
