import type { Triangle } from '@mander/utils';

import { computeSpikeTriangles } from './compute-spike-triangles';
import type { FallingSpike } from './falling-spike';

export const fallingSpikeTriangles = (spike: FallingSpike): Triangle[] =>
  computeSpikeTriangles(
    spike.position.x,
    spike.position.y,
    'CEILING',
    'SINGLE',
  );
