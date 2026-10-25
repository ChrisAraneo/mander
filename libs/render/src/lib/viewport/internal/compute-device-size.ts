import { round } from 'lodash-es';
import type { DeviceSize } from '../types/device-size';

export const computeDeviceSize = (
  canvas: HTMLCanvasElement,
  pixelRatio: number,
): DeviceSize => ({
  width: round(Math.max(1, canvas.clientWidth) * pixelRatio),
  height: round(Math.max(1, canvas.clientHeight) * pixelRatio),
});
