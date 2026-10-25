import { computeDeviceSize } from './internal/compute-device-size';
import type { DeviceSize } from './types/device-size';

export const getDeviceSize = (canvas: HTMLCanvasElement): DeviceSize =>
  computeDeviceSize(canvas, window.devicePixelRatio || 1);
