import { BLOCK } from '@mander/generator';

import { createCanvas } from '../dom/create-canvas';
import { createEditorView } from './create-editor-view';
import { createFlatGrid } from '../grid/create-flat-grid';
import { createHtmlElement } from '../dom/create-html-element';
import type { State } from '../types/state';

export const createState = (): State => {
  const view = createEditorView();
  const canvas = createCanvas(view);

  return {
    grid: createFlatGrid(),
    tool: BLOCK,
    isPainting: false,
    paintValue: BLOCK,
    view,
    canvas,
    context: canvas.getContext('2d')!,
    status: createHtmlElement('div', { className: 'status' }),
    output: createHtmlElement('textarea', {
      className: 'output',
      readOnly: true,
      spellcheck: false,
    }),
    loader: createHtmlElement('textarea', {
      className: 'loader',
      spellcheck: false,
      placeholder: 'Paste a structure grid here to edit it…',
    }),
    toast: createHtmlElement('div', { className: 'toast' }),
  };
};
