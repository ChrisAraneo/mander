import { match } from 'ts-pattern';
import type { CanvasSizeChange } from './types/canvas-size-change';

export const computeCanvasWidthChange = (
  canvas: HTMLCanvasElement,
  width: number,
): CanvasSizeChange =>
  match(canvas.width !== width)
    .with(true, (): CanvasSizeChange => ({ width }))
    .otherwise((): CanvasSizeChange => ({}));
