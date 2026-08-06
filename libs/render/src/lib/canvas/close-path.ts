import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const closePath: CanvasStep = run((context) => context.closePath());
