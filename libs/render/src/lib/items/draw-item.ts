import type { Item } from '@mander/model';
import { draw } from '../canvas/draw';
import { getItemArt } from './get-item-art';
import { createItemArtStep } from './internal/create-item-art-step';

export const drawItem = (
  context: CanvasRenderingContext2D,
  item: Item,
  size: number,
): void => draw(context, createItemArtStep(getItemArt(item), size));
