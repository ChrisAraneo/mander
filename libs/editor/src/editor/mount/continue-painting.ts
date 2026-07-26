import { match, P } from 'ts-pattern';

import { cellAt } from './cell-at';
import type { State } from '../types/state';
import { paintCell } from './paint-cell';

export const continuePainting = (state: State, event: PointerEvent): void =>
  match(state.isPainting)
    .with(false, () => undefined)
    .otherwise(() =>
      match(cellAt(state.canvas, event))
        .with(P.nullish, () => undefined)
        .otherwise((cell) => paintCell(state, cell)),
    );
