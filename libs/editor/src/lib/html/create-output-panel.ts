import { copyOutput } from '../mount/copy-output';
import { createHtmlElement } from './create-html-element';
import type { State } from '../types/state';

export const createOutputPanel = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'panel' },
    createHtmlElement('h2', { textContent: 'Structure code' }),
    createHtmlElement('p', {
      className: 'hint',
      textContent:
        'Paste this array into NORMAL_STRUCTURES or HARD_STRUCTURES in libs/generator/src/lib/structures/library.ts.',
    }),
    state.output,
    createHtmlElement(
      'div',
      { className: 'row' },
      createHtmlElement('button', {
        className: 'primary',
        textContent: 'Copy',
        onclick: () => copyOutput(state),
      }),
      state.toast,
    ),
  );
