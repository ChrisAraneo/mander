import { match } from 'ts-pattern';
import type { CanvasStep } from '../types/canvas-step';
import { createSequenceStep } from './create-sequence-step';
import { drawNothing } from './draw-nothing';

export const createConditionalStep = (
  shouldRun: boolean,
  ...steps: CanvasStep[]
): CanvasStep =>
  match(shouldRun)
    .with(true, () => createSequenceStep(steps))
    .otherwise(() => drawNothing);
