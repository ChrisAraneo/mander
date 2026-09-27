import type { Tile } from '@mander/model';

import { paint } from '../canvas';
import type { MaterialStyle } from './material-style';
import { createMaterialStep } from './create-material-step';

export const drawMaterial = (
  context: CanvasRenderingContext2D,
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): void => paint(context, createMaterialStep(tile, pixelX, pixelY, style));
