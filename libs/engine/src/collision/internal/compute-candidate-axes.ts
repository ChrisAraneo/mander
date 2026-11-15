import type { Triangle } from '@mander/model';
import { computeEdgeAxes } from './compute-edge-axes';
import type { Axis } from './types/axis';

const BOX_AXES: Axis[] = [
  { normalX: 1, normalY: 0 },
  { normalX: 0, normalY: 1 },
];

export const computeCandidateAxes = (triangle: Triangle): Axis[] => [
  ...BOX_AXES,
  ...computeEdgeAxes(triangle),
];
