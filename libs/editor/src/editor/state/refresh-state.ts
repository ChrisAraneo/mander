import { checkPlayerReach } from '@mander/engine';
import { formatStructure, structureTileMap } from '@mander/generator';

import { applyStatus } from '../mount/apply-status';
import { drawStructure } from '../draw/draw-structure';
import type { State } from '../types/state';

export const refreshState = (state: State): void => {
  const reach = checkPlayerReach(structureTileMap(state.grid));

  drawStructure(state.context, state.grid, state.view, reach);
  state.output.value = formatStructure(state.grid);
  applyStatus(state.status, state.grid, reach);
};
