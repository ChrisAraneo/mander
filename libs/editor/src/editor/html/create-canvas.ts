import { chain } from '@mander/utils';

import { createHtmlElement } from './create-html-element';
import type { EditorView } from '../types/editor-view';

export const createCanvas = (view: EditorView): HTMLCanvasElement =>
  chain(
    createHtmlElement('canvas', {
      width: view.cssWidth * view.pixelRatio,
      height: view.cssHeight * view.pixelRatio,
    }),
  )
    .tap((canvas) => {
      canvas.style.width = `${view.cssWidth}px`;
      canvas.style.height = `${view.cssHeight}px`;
    })
    .value();
