import { map } from 'lodash-es';

import { createHtmlElement } from './create-html-element';

export const createIssuesStatus = (issues: string[]): HTMLElement[] => [
  createHtmlElement('div', {
    className: 'headline',
    textContent: '✗ Not usable yet',
  }),
  createHtmlElement(
    'ul',
    {},
    ...map(issues, (issue) => createHtmlElement('li', { textContent: issue })),
  ),
];
