import { computeFallingSpikeTriangles, type FallingSpike } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';

import { type CanvasStep, type ColorStop, sequence } from '../canvas';
import { createProngStep } from './create-spike-step';

const FALLING_SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#797D8E'],
  [1, '#C2C5CF'],
];

export const createFallingSpikeStep = (spike: FallingSpike): CanvasStep =>
  chain(computeFallingSpikeTriangles(spike))
    .thru((triangles) =>
      map(triangles, (triangle) =>
        createProngStep(triangle, FALLING_SPIKE_STOPS),
      ),
    )
    .thru(sequence)
    .value();
