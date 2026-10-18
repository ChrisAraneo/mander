import { chain } from '@mander/model';
import type { Viewport } from '../types/viewport';
import { getDeviceSize } from './get-device-size';
import { getViewportScale } from './get-viewport-scale';
import { resizeCanvas } from './resize-canvas';

export const syncViewport = (canvas: HTMLCanvasElement): Viewport =>
  chain({ size: getDeviceSize(canvas), scale: getViewportScale(canvas) })
    .thru(({ size, scale }) => ({ resized: resizeCanvas(canvas, size), scale }))
    .thru(({ resized, scale }) => ({
      width: resized.width / scale,
      height: resized.height / scale,
      scale,
    }))
    .value();
