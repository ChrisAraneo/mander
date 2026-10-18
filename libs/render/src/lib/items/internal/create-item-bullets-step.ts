import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { ICE_BULLET } from '../../bullet/consts';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createShadedSphereStep } from '../../sphere/create-shaded-sphere-step';
import type { CanvasStep } from '../../types/canvas-step';
import { getBulletCluster } from './get-bullet-cluster';

export const createItemBulletsStep = (
  count: number,
  size: number,
): CanvasStep =>
  chain(getBulletCluster(count))
    .thru((cluster) =>
      createSequenceStep(
        map(cluster.spots, (spot) =>
          createShadedSphereStep(
            size * spot.x,
            size * spot.y,
            size * cluster.radius,
            ICE_BULLET,
          ),
        ),
      ),
    )
    .value();
