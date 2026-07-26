import { match, P } from 'ts-pattern';

import { cellAt } from './cell-at';
import type { State } from '../types/state';
import { nextPaintValue } from './next-paint-value';
import { paintCell } from './paint-cell';

export const startPainting = (state: State, event: PointerEvent): void =>
  match(cellAt(state.canvas, event))
    .with(P.nullish, () => undefined)
    .otherwise((cell) => {
      state.isPainting = true;
      state.paintValue = nextPaintValue(state, cell);
      state.canvas.setPointerCapture(event.pointerId);
      paintCell(state, cell);
    });
