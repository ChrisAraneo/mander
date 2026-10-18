import { map } from 'lodash-es';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { ItemCluster } from './types/item-cluster';

export const createItemClusterStep = (
  cluster: ItemCluster,
  size: number,
  toStep: (centerX: number, centerY: number, scale: number) => CanvasStep,
): CanvasStep =>
  createSequenceStep(
    map(cluster.spots, (spot) =>
      toStep(size * spot.x, size * spot.y, size * cluster.scale),
    ),
  );
