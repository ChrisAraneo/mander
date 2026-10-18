import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { ICE_BULLET } from '../../bullet/consts';
import { createBulletBodyStep } from '../../bullet/create-bullet-body-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
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
          createBulletBodyStep(
            size * spot.x,
            size * spot.y,
            size * cluster.radius,
            ICE_BULLET,
          ),
        ),
      ),
    )
    .value();
