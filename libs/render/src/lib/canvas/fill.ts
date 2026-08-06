import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const fill: CanvasStep = run((context) => context.fill());
