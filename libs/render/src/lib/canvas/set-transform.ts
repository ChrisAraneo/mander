import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const setTransform = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
): CanvasStep => run((context) => context.setTransform(a, b, c, d, e, f));
