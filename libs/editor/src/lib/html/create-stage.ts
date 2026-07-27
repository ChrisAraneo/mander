import { createHtmlElement } from './create-html-element';
import { createLegend } from './create-legend';
import { createToolbar } from './create-toolbar';
import type { State } from '../types/state';

export const createStage = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'stage' },
    createToolbar(state),
    state.canvas,
    createLegend(),
  );
