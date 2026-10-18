import { clamp, round } from 'lodash-es';
import type { StarCluster } from './types/star-cluster';

const STAR_CLUSTERS: Readonly<Record<number, StarCluster>> = Object.freeze({
  1: { radius: 0.42, spots: [{ x: 0.5, y: 0.52 }] },
  2: {
    radius: 0.3,
    spots: [
      { x: 0.36, y: 0.38 },
      { x: 0.66, y: 0.66 },
    ],
  },
  3: {
    radius: 0.24,
    spots: [
      { x: 0.5, y: 0.3 },
      { x: 0.29, y: 0.68 },
      { x: 0.71, y: 0.68 },
    ],
  },
});

const LARGEST_STAR_CLUSTER = 3;

export const getStarCluster = (count: number): StarCluster =>
  STAR_CLUSTERS[clamp(round(count), 1, LARGEST_STAR_CLUSTER)];
