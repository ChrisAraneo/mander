import { type FallingSpike, fallingSpikeTriangles } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';

import { type CanvasStep, type ColorStop, sequence } from '../canvas';
import { prongStep } from './spike-step';

const FALLING_SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#7E1B22'],
  [1, '#F0555E'],
];

export const fallingSpikeStep = (spike: FallingSpike): CanvasStep =>
  chain(fallingSpikeTriangles(spike))
    .thru((triangles) =>
      map(triangles, (triangle) => prongStep(triangle, FALLING_SPIKE_STOPS)),
    )
    .thru(sequence)
    .value();
