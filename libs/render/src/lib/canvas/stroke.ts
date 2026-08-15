import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const stroke: CanvasStep = run((context) => context.stroke());
