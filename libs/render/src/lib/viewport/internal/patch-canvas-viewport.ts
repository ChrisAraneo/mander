import { pipe } from 'remeda';
import type { Viewport } from '../../types/viewport';
import { patchCanvasSize } from '../patch-canvas-size';
import { computeDeviceSize } from './compute-device-size';
import { computeViewportScale } from './compute-viewport-scale';

export const patchCanvasViewport = (
  canvas: HTMLCanvasElement,
  pixelRatio: number,
): Viewport =>
  pipe(
    {
      size: computeDeviceSize(canvas, pixelRatio),
      scale: computeViewportScale(canvas, pixelRatio),
    },
    ({ size, scale }) => ({ resized: patchCanvasSize(canvas, size), scale }),
    ({ resized, scale }): Viewport => ({
      width: resized.width / scale,
      height: resized.height / scale,
      scale,
    }),
  );
