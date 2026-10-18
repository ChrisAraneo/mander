import { chain } from '@mander/utils';
import { round, times } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createItemFireballStep } from './create-item-fireball-step';

export const createItemFireballsStep = (
  count: number,
  size: number,
): CanvasStep =>
  chain(Math.max(1, round(count)))
    .thru((orbiting) =>
      createSequenceStep(
        times(orbiting, (index) =>
          createItemFireballStep(index, orbiting, size),
        ),
      ),
    )
    .value();
