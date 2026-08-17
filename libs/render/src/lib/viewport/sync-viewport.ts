import { chain } from '@mander/utils';

import { deviceSize } from './device-size';
import { resizeCanvas } from './resize-canvas';
import { viewportScale } from './viewport-scale';
import type { Viewport } from './viewport';

export const syncViewport = (canvas: HTMLCanvasElement): Viewport =>
  chain({ size: deviceSize(canvas), scale: viewportScale(canvas) })
    .thru(({ size, scale }) => ({ resized: resizeCanvas(canvas, size), scale }))
    .thru(({ resized, scale }) => ({
      width: resized.width / scale,
      height: resized.height / scale,
      scale,
    }))
    .value();
