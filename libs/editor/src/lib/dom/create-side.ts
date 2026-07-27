import { createHtmlElement } from './create-html-element';
import { createLoadPanel } from './create-load-panel';
import { createOutputPanel } from './create-output-panel';
import { createValidationPanel } from './create-validation-panel';
import type { State } from '../types/state';

export const createSide = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'side' },
    createValidationPanel(state),
    createOutputPanel(state),
    createLoadPanel(state),
  );
