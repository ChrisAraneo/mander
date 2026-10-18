import { round } from 'lodash-es';
import type { DeviceSize } from './types/device-size';

export const getDeviceSize = (canvas: HTMLCanvasElement): DeviceSize => ({
  width: round(
    Math.max(1, canvas.clientWidth) * (window.devicePixelRatio || 1),
  ),
  height: round(
    Math.max(1, canvas.clientHeight) * (window.devicePixelRatio || 1),
  ),
});
