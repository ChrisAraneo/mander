import { match } from 'ts-pattern';

import { createExampleOptions } from './create-example-options';
import { createExamples } from '../mount/create-examples';
import { createHtmlElement } from './create-html-element';
import type { State } from '../types/state';
import { loadGrid } from '../mount/load-grid';

export const createExamplesSelect = (state: State): HTMLSelectElement => {
  const examples = createExamples();
  const select = createHtmlElement(
    'select',
    {},
    ...createExampleOptions(examples),
  );

  select.addEventListener('change', () => {
    const index = Number(select.value);

    match(select.value !== '' && Boolean(examples[index]))
      .with(true, () => loadGrid(state, examples[index].grid))
      .otherwise(() => undefined);
    select.value = '';
  });

  return select;
};
