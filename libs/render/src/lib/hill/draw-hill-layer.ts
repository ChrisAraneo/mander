import { draw } from '../canvas/draw';
import type { Viewport } from '../types/viewport';
import { createHillLayerStep } from './internal/create-hill-layer-step';
import type { HillLayer } from './types/hill-layer';

export const drawHillLayer = (
  context: CanvasRenderingContext2D,
  cameraX: number,
  layer: HillLayer,
  color: string,
  viewport: Viewport,
): void => draw(context, createHillLayerStep(cameraX, layer, color, viewport));
