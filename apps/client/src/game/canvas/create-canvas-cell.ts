import { type Ref, shallowRef } from 'vue';
import type { CanvasCell } from './types/canvas-cell';

export const createCanvasCell = (
  canvas: Ref<HTMLCanvasElement | null>,
): CanvasCell => ({
  canvas,
  context: shallowRef<CanvasRenderingContext2D | null>(null),
});
