import { isNil } from 'lodash-es';
import { match } from 'ts-pattern';
import type { CanvasStep } from '../types/canvas-step';
import { drawNothing } from './draw-nothing';

export const createOptionalStep = <T>(
  value: T | null | undefined,
  toStep: (value: T) => CanvasStep,
): CanvasStep =>
  match(value)
    .when(
      (present): present is T => !isNil(present),
      (present) => toStep(present),
    )
    .otherwise(() => drawNothing);
