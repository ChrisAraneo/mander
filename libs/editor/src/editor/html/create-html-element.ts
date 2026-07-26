import { chain } from 'lodash-es';

export const createHtmlElement = <TagName extends keyof HTMLElementTagNameMap>(
  tag: TagName,
  props: Partial<HTMLElementTagNameMap[TagName]> = {},
  ...children: Array<Node | string>
): HTMLElementTagNameMap[TagName] =>
  chain(document.createElement(tag))
    .assign(props)
    .tap((node) => node.append(...children))
    .value();
