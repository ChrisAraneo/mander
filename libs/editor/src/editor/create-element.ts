import { assign } from 'lodash-es';

export function createElement<TagName extends keyof HTMLElementTagNameMap>(
  tag: TagName,
  props: Partial<HTMLElementTagNameMap[TagName]> = {},
  ...children: Array<Node | string>
): HTMLElementTagNameMap[TagName] {
  const node = document.createElement(tag);
  assign(node, props);
  node.append(...children);
  return node;
}
