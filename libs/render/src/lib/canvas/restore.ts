import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const restore: CanvasStep = run((context) => context.restore());
