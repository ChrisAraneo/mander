import { createStarStep } from '../../star/create-star-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { ShadeColors } from '../../types/shade-colors';
import { STAR_CLUSTERS } from './consts';
import { createItemClusterStep } from './create-item-cluster-step';
import { findItemCluster } from './find-item-cluster';

export const createItemStarsStep = (
  count: number,
  size: number,
  colors: ShadeColors,
): CanvasStep =>
  createItemClusterStep(
    findItemCluster(STAR_CLUSTERS, count),
    size,
    (centerX, centerY, scale) =>
      createStarStep(centerX, centerY, scale, colors),
  );
