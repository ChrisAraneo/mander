import { ICE_BULLET } from '../../bullet/consts';
import { createShadedSphereStep } from '../../sphere/create-shaded-sphere-step';
import type { CanvasStep } from '../../types/canvas-step';
import { BULLET_CLUSTERS } from './consts';
import { createItemClusterStep } from './create-item-cluster-step';
import { findItemCluster } from './find-item-cluster';

export const createItemBulletsStep = (
  count: number,
  size: number,
): CanvasStep =>
  createItemClusterStep(
    findItemCluster(BULLET_CLUSTERS, count),
    size,
    (centerX, centerY, scale) =>
      createShadedSphereStep(centerX, centerY, scale, ICE_BULLET),
  );
