import { createHeader } from './create-header';
import { createHtmlElement } from './create-html-element';
import { createSide } from './create-side';
import { createStage } from './create-stage';
import type { State } from '../types/state';

export const createApp = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'app' },
    createHeader(),
    createHtmlElement(
      'div',
      { className: 'layout' },
      createStage(state),
      createSide(state),
    ),
  );
