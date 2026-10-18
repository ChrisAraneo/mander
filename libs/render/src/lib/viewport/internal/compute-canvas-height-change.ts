import { match } from 'ts-pattern';
import type { CanvasSizeChange } from './types/canvas-size-change';

export const computeCanvasHeightChange = (
  canvas: HTMLCanvasElement,
  height: number,
): CanvasSizeChange =>
  match(canvas.height !== height)
    .with(true, (): CanvasSizeChange => ({ height }))
    .otherwise((): CanvasSizeChange => ({}));
