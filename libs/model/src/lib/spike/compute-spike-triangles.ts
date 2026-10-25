import { times } from 'lodash-es';
import { pipe } from 'remeda';
import { PRONG_PITCH } from './consts';
import { computeFirstProngLeft } from './internal/compute-first-prong-left';
import { computeProngEdges } from './internal/compute-prong-edges';
import { createProngTriangle } from './internal/create-prong-triangle';
import { toProngCount } from './internal/to-prong-count';
import type { SpikeOrientation } from './types/spike-orientation';
import type { SpikeShape } from './types/spike-shape';
import type { Triangle } from './types/triangle';

export const computeSpikeTriangles = (
  pixelX: number,
  pixelY: number,
  orientation: SpikeOrientation,
  shape: SpikeShape,
): Triangle[] =>
  pipe(
    shape,
    toProngCount,
    (prongs) => ({
      prongs,
      left: computeFirstProngLeft(pixelX, prongs),
      edges: computeProngEdges(pixelY, orientation),
    }),
    ({ prongs, left, edges }) =>
      times(prongs, (prongIndex) =>
        createProngTriangle(left + prongIndex * PRONG_PITCH, edges),
      ),
  );
