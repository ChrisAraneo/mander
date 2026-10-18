import type { Tile } from '@mander/model';
import { draw } from '../canvas/draw';
import type { MaterialStyle } from '../types/material-style';
import { createMaterialStep } from './create-material-step';

export const drawMaterial = (
  context: CanvasRenderingContext2D,
  tile: Tile,
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): void => draw(context, createMaterialStep(tile, pixelX, pixelY, style));
