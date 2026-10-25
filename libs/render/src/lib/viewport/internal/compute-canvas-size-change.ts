import { get, pickBy } from 'lodash-es';
import type { DeviceSize } from '../types/device-size';
import type { CanvasSizeChange } from './types/canvas-size-change';

export const computeCanvasSizeChange = (
  canvas: HTMLCanvasElement,
  size: DeviceSize,
): CanvasSizeChange => pickBy(size, (value, key) => get(canvas, key) !== value);
