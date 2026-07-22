import { createElement } from './create-element';

export function swatch(color: string, label: string): HTMLElement {
  const box = createElement('span', { className: 'swatch' });
  box.style.background = color;
  return createElement('span', {}, box, label);
}
