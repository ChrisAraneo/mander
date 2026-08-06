import { match } from 'ts-pattern';

import type { CanvasStep } from './canvas-step';
import { sequence } from './sequence';
import { skip } from './skip';

export const when = (condition: boolean, ...steps: CanvasStep[]): CanvasStep =>
  match(condition)
    .with(true, () => sequence(steps))
    .otherwise(() => skip);
