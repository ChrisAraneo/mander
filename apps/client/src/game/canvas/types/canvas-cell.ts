import type { Ref, ShallowRef } from 'vue';

export interface CanvasCell {
  canvas: Ref<HTMLCanvasElement | null>;
  context: ShallowRef<CanvasRenderingContext2D | null>;
}
