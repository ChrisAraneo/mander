import { continuePainting } from './continue-painting';
import type { State } from '../types/state';
import { startPainting } from './start-painting';
import { stopPainting } from './stop-painting';

export const bindPainting = (state: State): void => {
  state.canvas.addEventListener('pointerdown', (event) =>
    startPainting(state, event),
  );
  state.canvas.addEventListener('pointermove', (event) =>
    continuePainting(state, event),
  );
  state.canvas.addEventListener('pointerup', () => stopPainting(state));
  state.canvas.addEventListener('pointercancel', () => stopPainting(state));
};
