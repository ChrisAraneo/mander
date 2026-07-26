import type { Structure } from '@mander/generator';

import { createHtmlElement } from './create-html-element';
import { validSummary } from '../mount/valid-summary';

export const createValidStatus = (grid: Structure): HTMLElement[] => [
  createHtmlElement('div', {
    className: 'headline',
    textContent: '✓ Valid structure',
  }),
  createHtmlElement('div', {
    className: 'meta',
    textContent: validSummary(grid),
  }),
];
