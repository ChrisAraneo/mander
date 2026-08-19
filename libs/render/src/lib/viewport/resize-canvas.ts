import { chain } from '@mander/utils';
import { assign } from 'lodash-es';
import { match } from 'ts-pattern';

import type { DeviceSize } from './device-size';

type CanvasSize = Partial<Pick<HTMLCanvasElement, 'width' | 'height'>>;

const widthChange = (canvas: HTMLCanvasElement, width: number): CanvasSize =>
  match(canvas.width !== width)
    .with(true, (): CanvasSize => ({ width }))
    .otherwise((): CanvasSize => ({}));

const heightChange = (canvas: HTMLCanvasElement, height: number): CanvasSize =>
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
      widthChange(canvas, size.width),
      heightChange(canvas, size.height),
    ),
  )
    .thru((change) => assign(canvas, change))
    .value();
