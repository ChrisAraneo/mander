import { formatStructure } from '@mander/generator';

import { applyStatus } from '../mount/apply-status';
import { drawStructure } from '../draw/draw-structure';
import type { State } from '../types/state';

export const refreshState = (state: State): void => {
  drawStructure(state.context, state.grid, state.view);
  state.output.value = formatStructure(state.grid);
  applyStatus(state.status, state.grid);
};
