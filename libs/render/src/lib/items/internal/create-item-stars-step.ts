import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStarStep } from '../../star/create-star-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { ShadeColors } from '../../types/shade-colors';
import { getStarCluster } from './get-star-cluster';

export const createItemStarsStep = (
  count: number,
  size: number,
  colors: ShadeColors,
): CanvasStep =>
  chain(getStarCluster(count))
    .thru((cluster) =>
      createSequenceStep(
        map(cluster.spots, (spot) =>
          createStarStep(
            size * spot.x,
            size * spot.y,
            size * cluster.radius,
            colors,
          ),
        ),
      ),
    )
    .value();
