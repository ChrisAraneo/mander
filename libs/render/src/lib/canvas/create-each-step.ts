import { map } from 'lodash-es';
import type { CanvasStep } from '../types/canvas-step';
import { createSequenceStep } from './create-sequence-step';

export const createEachStep = <T>(
  items: readonly T[],
  toStep: (item: T) => CanvasStep,
): CanvasStep => createSequenceStep(map(items, (item) => toStep(item)));
