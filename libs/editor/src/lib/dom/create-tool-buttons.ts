import { forEach, map } from 'lodash-es';

import { createHtmlElement } from './create-html-element';
import type { State } from '../types/state';
import { TOOLS } from '../config/constants';

const markActive = (buttons: HTMLButtonElement[], tool: number): void => {
  forEach(buttons, (button, index) => {
    button.classList.toggle('active', TOOLS[index].value === tool);
  });
};

export const createToolButtons = (state: State): HTMLButtonElement[] => {
  const buttons: HTMLButtonElement[] = map([...TOOLS], (toolOption) =>
    createHtmlElement('button', {
      className: 'toolbtn',
      textContent: toolOption.label,
      onclick: () => {
        state.tool = toolOption.value;
        markActive(buttons, state.tool);
      },
    }),
  );

  markActive(buttons, state.tool);

  return buttons;
};
