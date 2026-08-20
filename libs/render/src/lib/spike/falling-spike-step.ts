import { type FallingSpike, fallingSpikeTriangles } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';

import { type CanvasStep, type ColorStop, sequence } from '../canvas';
import { prongStep } from './spike-step';

const FALLING_SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#797D8E'],
  [1, '#C2C5CF'],
];

export const fallingSpikeStep = (spike: FallingSpike): CanvasStep =>
  chain(fallingSpikeTriangles(spike))
    .thru((triangles) =>
      map(triangles, (triangle) => prongStep(triangle, FALLING_SPIKE_STOPS)),
    )
    .thru(sequence)
    .value();
