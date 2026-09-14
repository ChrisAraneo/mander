import { chain } from '@mander/utils';

import { getDeviceSize } from './get-device-size';
import { resizeCanvas } from './resize-canvas';
import { getViewportScale } from './get-viewport-scale';
import type { Viewport } from './viewport';

export const syncViewport = (canvas: HTMLCanvasElement): Viewport =>
  chain({ size: getDeviceSize(canvas), scale: getViewportScale(canvas) })
    .thru(({ size, scale }) => ({ resized: resizeCanvas(canvas, size), scale }))
    .thru(({ resized, scale }) => ({
      width: resized.width / scale,
      height: resized.height / scale,
      scale,
    }))
    .value();
