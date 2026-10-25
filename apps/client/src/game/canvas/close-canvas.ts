import { patchRef } from './patch-ref';
import type { CanvasCell } from './types/canvas-cell';

export const closeCanvas = (
  cell: CanvasCell,
): CanvasRenderingContext2D | null => patchRef(cell.context, null);
