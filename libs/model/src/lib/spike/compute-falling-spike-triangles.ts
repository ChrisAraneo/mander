import { computeSpikeTriangles } from './compute-spike-triangles';
import type { FallingSpike } from './types/falling-spike';
import type { Triangle } from './types/triangle';

export const computeFallingSpikeTriangles = (spike: FallingSpike): Triangle[] =>
  computeSpikeTriangles(
    spike.position.x,
    spike.position.y,
    'CEILING',
    'SINGLE',
  );
