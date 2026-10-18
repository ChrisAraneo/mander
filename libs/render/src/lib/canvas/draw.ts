import { chain } from '@mander/model';
import { noop } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';
import { createSequenceStep } from './create-sequence-step';

export const draw = (
  context: CanvasRenderingContext2D,
  ...steps: CanvasStep[]
): void => chain(context).thru(createSequenceStep(steps)).thru(noop).value();
