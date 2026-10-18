import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createHeartStep } from '../create-heart-step';
import { getHeartCluster } from './get-heart-cluster';

const HEART_LOBE = 0.26;

export const createItemHeartsStep = (count: number, size: number): CanvasStep =>
  chain(getHeartCluster(count))
    .thru((cluster) =>
      createSequenceStep(
        map(cluster.spots, (spot) =>
          createHeartStep(
            size * spot.x,
            size * spot.y,
            size * HEART_LOBE * cluster.lobe,
          ),
        ),
      ),
    )
    .value();
