import { chain } from '@mander/utils';
import { assign } from 'lodash-es';
import { computeCanvasHeightChange } from './internal/compute-canvas-height-change';
import { computeCanvasWidthChange } from './internal/compute-canvas-width-change';
import type { DeviceSize } from './types/device-size';

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  size: DeviceSize,
): HTMLCanvasElement =>
  chain(
    assign(
      {},
      computeCanvasWidthChange(canvas, size.width),
      computeCanvasHeightChange(canvas, size.height),
    ),
  )
    .thru((change) => assign(canvas, change))
    .value();
