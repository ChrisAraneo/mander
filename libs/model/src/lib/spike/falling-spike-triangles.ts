import type { Triangle } from '@mander/utils';

import { computeSpikeTrianglesAt } from './compute-spike-triangles';
import type { FallingSpike } from './falling-spike';

export const fallingSpikeTriangles = (spike: FallingSpike): Triangle[] =>
  computeSpikeTrianglesAt(
    spike.position.x,
    spike.position.y,
    'CEILING',
    'SINGLE',
  );
