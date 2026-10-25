import { match, P } from 'ts-pattern';
import { patchRef } from './patch-ref';
import type { CanvasCell } from './types/canvas-cell';

const { nonNullable } = P;

export const initializeCanvas = (
  cell: CanvasCell,
): CanvasRenderingContext2D | null =>
  patchRef(
    cell.context,
    match(cell.canvas.value)
      .with(nonNullable, (mounted) =>
        mounted.getContext('2d', { alpha: false }),
      )
      .otherwise(() => null),
  );
