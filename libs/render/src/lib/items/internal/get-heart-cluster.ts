import { clamp, round } from 'lodash-es';
import type { HeartCluster } from './types/heart-cluster';

const HEART_CLUSTERS: Readonly<Record<number, HeartCluster>> = Object.freeze({
  1: { lobe: 1, spots: [{ x: 0.5, y: 0.46 }] },
  2: {
    lobe: 0.66,
    spots: [
      { x: 0.34, y: 0.32 },
      { x: 0.65, y: 0.6 },
    ],
  },
  3: {
    lobe: 0.58,
    spots: [
      { x: 0.5, y: 0.26 },
      { x: 0.3, y: 0.62 },
      { x: 0.72, y: 0.6 },
    ],
  },
});

const LARGEST_HEART_CLUSTER = 3;

export const getHeartCluster = (count: number): HeartCluster =>
  HEART_CLUSTERS[clamp(round(count), 1, LARGEST_HEART_CLUSTER)];
