import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const beginPath: CanvasStep = run((context) => context.beginPath());
