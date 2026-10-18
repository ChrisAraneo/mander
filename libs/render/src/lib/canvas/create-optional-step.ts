import { match, P } from 'ts-pattern';
import type { CanvasStep } from '../types/canvas-step';
import { drawNothing } from './draw-nothing';

const { nullish } = P;

export const createOptionalStep = <T>(
  value: T | null | undefined,
  toStep: (value: T) => CanvasStep,
): CanvasStep =>
  match(value)
    .with(nullish, () => drawNothing)
    .otherwise((present) => toStep(present as T));
