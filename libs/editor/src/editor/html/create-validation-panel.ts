import { createHtmlElement } from './create-html-element';
import type { State } from '../types/state';

export const createValidationPanel = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'panel' },
    createHtmlElement('h2', { textContent: 'Validation' }),
    state.status,
  );
