import type { Rectangle } from '@mander/model';

export const isOverlappingBox = (
  box: Rectangle,
  otherBox: Rectangle,
): boolean =>
  box.x < otherBox.x + otherBox.width &&
  box.x + box.width > otherBox.x &&
  box.y < otherBox.y + otherBox.height &&
  box.y + box.height > otherBox.y;
