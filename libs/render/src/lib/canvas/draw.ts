import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import type { CanvasStep } from '../types/canvas-step';
import { createSequenceStep } from './create-sequence-step';

export const draw = (
  context: CanvasRenderingContext2D,
  ...steps: CanvasStep[]
): void => pipe(context, createSequenceStep(steps), noop);
