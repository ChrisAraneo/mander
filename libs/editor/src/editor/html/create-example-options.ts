import { map } from 'lodash-es';

import { createHtmlElement } from './create-html-element';
import type { StructureExample } from '../types/structure-example';

export const createExampleOptions = (
  examples: StructureExample[],
): HTMLOptionElement[] => [
  createHtmlElement('option', { value: '', textContent: 'Load an example…' }),
  ...map(examples, (example, index) =>
    createHtmlElement('option', {
      value: String(index),
      textContent: example.label,
    }),
  ),
];
