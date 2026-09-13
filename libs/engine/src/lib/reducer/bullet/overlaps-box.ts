import type { Rectangle } from '@mander/utils';

export const overlapsBox = (a: Rectangle, b: Rectangle): boolean =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;
