import { match } from 'ts-pattern';

import type { CanvasStep } from './canvas-step';
import { sequence } from './sequence';
import { skip } from './skip';

export const when = (shouldRun: boolean, ...steps: CanvasStep[]): CanvasStep =>
  match(shouldRun)
    .with(true, () => sequence(steps))
    .otherwise(() => skip);
