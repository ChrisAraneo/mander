import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const save: CanvasStep = run((context) => context.save());
