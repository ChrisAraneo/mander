import { chain } from '../../../../utils/src/lib/chain';
import { createHtmlElement } from './create-html-element';

export const createSwatch = (color: string, label: string): HTMLElement =>
  chain(createHtmlElement('span', { className: 'swatch' }))
    .tap((box) => {
      box.style.background = color;
    })
    .thru((box) => createHtmlElement('span', {}, box, label))
    .value();
