import { chain, identity, noop, reduce } from 'lodash-es';
import { match } from 'ts-pattern';

import type { CanvasStep } from './canvas-step';

export const skip: CanvasStep = identity;

export const sequence =
  (steps: readonly CanvasStep[]): CanvasStep =>
  (context) =>
    reduce(steps, (current, next) => next(current), context);

export const when = (condition: boolean, ...steps: CanvasStep[]): CanvasStep =>
  match(condition)
    .with(true, () => sequence(steps))
    .otherwise(() => skip);

export const paint = (
  context: CanvasRenderingContext2D,
  ...steps: CanvasStep[]
): void => chain(context).thru(sequence(steps)).thru(noop).value();
