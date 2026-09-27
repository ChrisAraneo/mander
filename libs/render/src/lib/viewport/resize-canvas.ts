import { chain } from '@mander/utils';
import { assign } from 'lodash-es';
import { match } from 'ts-pattern';

import type { DeviceSize } from './get-device-size';

type CanvasSize = Partial<Pick<HTMLCanvasElement, 'width' | 'height'>>;

const getWidthChange = (canvas: HTMLCanvasElement, width: number): CanvasSize =>
  match(canvas.width !== width)
    .with(true, (): CanvasSize => ({ width }))
    .otherwise((): CanvasSize => ({}));

const getHeightChange = (
  canvas: HTMLCanvasElement,
  height: number,
): CanvasSize =>
  match(canvas.height !== height)
    .with(true, (): CanvasSize => ({ height }))
    .otherwise((): CanvasSize => ({}));

export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  size: DeviceSize,
): HTMLCanvasElement =>
  chain(
    assign(
      {},
      getWidthChange(canvas, size.width),
      getHeightChange(canvas, size.height),
    ),
  )
    .thru((change) => assign(canvas, change))
    .value();
