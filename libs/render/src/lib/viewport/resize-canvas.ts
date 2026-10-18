import { assign } from 'lodash-es';
import { computeCanvasSizeChange } from './internal/compute-canvas-size-change';
import type { DeviceSize } from './types/device-size';

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  size: DeviceSize,
): HTMLCanvasElement => assign(canvas, computeCanvasSizeChange(canvas, size));
