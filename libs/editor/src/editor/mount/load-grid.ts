import type { Structure } from '@mander/generator';

import { cloneGrid } from '../grid/clone-grid';
import type { State } from '../types/state';
import { refreshState } from '../state/refresh-state';

export const loadGrid = (state: State, grid: Structure): void => {
  state.grid = cloneGrid(grid);
  refreshState(state);
};
