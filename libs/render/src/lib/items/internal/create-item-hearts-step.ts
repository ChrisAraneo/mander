import type { CanvasStep } from '../../types/canvas-step';
import { createHeartStep } from '../create-heart-step';
import { HEART_CLUSTERS } from './consts';
import { createItemClusterStep } from './create-item-cluster-step';
import { getItemCluster } from './get-item-cluster';

const HEART_LOBE = 0.26;

export const createItemHeartsStep = (count: number, size: number): CanvasStep =>
  createItemClusterStep(
    getItemCluster(HEART_CLUSTERS, count),
    size,
    (centerX, centerY, scale) =>
      createHeartStep(centerX, centerY, scale * HEART_LOBE),
  );
