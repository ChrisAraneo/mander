import { chain } from '@mander/utils';
import { noop } from 'lodash-es';

import type { CanvasStep } from './canvas-step';
import { sequence } from './sequence';

export const paint = (
  context: CanvasRenderingContext2D,
  ...steps: CanvasStep[]
): void => chain(context).thru(sequence(steps)).thru(noop).value();
