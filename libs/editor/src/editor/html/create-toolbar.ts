import { createAirGrid } from '../grid/create-air-grid';
import { createExamplesSelect } from './create-examples-select';
import { createFlatGrid } from '../grid/create-flat-grid';
import { createHtmlElement } from './create-html-element';
import { createToolButtons } from './create-tool-buttons';
import type { State } from '../types/state';
import { fillGround } from '../mount/fill-ground';
import { loadGrid } from '../mount/load-grid';

export const createToolbar = (state: State): HTMLDivElement =>
  createHtmlElement(
    'div',
    { className: 'toolbar' },
    createHtmlElement('span', {
      className: 'toollabel',
      textContent: 'Paint:',
    }),
    ...createToolButtons(state),
    createHtmlElement('span', { className: 'spacer' }),
    createHtmlElement('button', {
      textContent: 'Flat',
      onclick: () => loadGrid(state, createFlatGrid()),
    }),
    createHtmlElement('button', {
      textContent: 'Fill ground',
      onclick: () => fillGround(state),
    }),
    createHtmlElement('button', {
      textContent: 'Clear',
      onclick: () => loadGrid(state, createAirGrid()),
    }),
    createExamplesSelect(state),
  );
