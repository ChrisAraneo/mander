import { createHtmlElement } from './create-html-element';
import type { State } from '../types/state';
import { loadFromText } from '../mount/load-from-text';

export const createLoadPanel = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'panel' },
    createHtmlElement('h2', { textContent: 'Load / edit existing' }),
    state.loader,
    createHtmlElement(
      'div',
      { className: 'row' },
      createHtmlElement('button', {
        textContent: 'Load from text',
        onclick: () => loadFromText(state),
      }),
    ),
  );
