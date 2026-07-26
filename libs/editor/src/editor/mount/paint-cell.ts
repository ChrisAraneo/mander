import { match } from 'ts-pattern';

import type { Cell } from '../types/cell';
import type { State } from '../types/state';
import { refreshState } from '../state/refresh-state';
import { setCell } from '../grid/set-cell';

export const paintCell = (state: State, cell: Cell): void =>
  match(state.grid[cell.row][cell.column] === state.paintValue)
    .with(true, () => undefined)
    .otherwise(() => {
      state.grid = setCell(state.grid, cell, state.paintValue);
      refreshState(state);
    });
