import type { CanvasStep } from './canvas-step';
import { run } from './run';

export const clip: CanvasStep = run((context) => context.clip());
