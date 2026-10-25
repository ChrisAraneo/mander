import { computeFallingSpikeTriangles, type FallingSpike } from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createSequenceStep } from '../canvas/create-sequence-step';
import type { CanvasStep } from '../types/canvas-step';
import type { ColorStop } from '../types/color-stop';
import { createProngStep } from './create-prong-step';

const FALLING_SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#797D8E'],
  [1, '#C2C5CF'],
];

export const createFallingSpikeStep = (spike: FallingSpike): CanvasStep =>
  pipe(
    spike,
    computeFallingSpikeTriangles,
    (triangles) =>
      map(triangles, (triangle) =>
        createProngStep(triangle, FALLING_SPIKE_STOPS),
      ),
    createSequenceStep,
  );
