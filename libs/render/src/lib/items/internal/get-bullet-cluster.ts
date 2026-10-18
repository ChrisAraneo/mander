import { sortBy, map, keys, findLast, round } from 'lodash-es';
import type { BulletCluster } from './types/bullet-cluster';

const BULLET_RAIN_FROM = 9;

const BULLET_CLUSTERS: Readonly<Record<number, BulletCluster>> = Object.freeze({
  1: { radius: 0.22, spots: [{ x: 0.5, y: 0.5 }] },
  2: {
    radius: 0.19,
    spots: [
      { x: 0.35, y: 0.37 },
      { x: 0.65, y: 0.63 },
    ],
  },
  3: {
    radius: 0.17,
    spots: [
      { x: 0.5, y: 0.28 },
      { x: 0.31, y: 0.64 },
      { x: 0.69, y: 0.64 },
    ],
  },
  4: {
    radius: 0.15,
    spots: [
      { x: 0.34, y: 0.34 },
      { x: 0.66, y: 0.34 },
      { x: 0.34, y: 0.66 },
      { x: 0.66, y: 0.66 },
    ],
  },
  6: {
    radius: 0.13,
    spots: [
      { x: 0.28, y: 0.34 },
      { x: 0.5, y: 0.34 },
      { x: 0.72, y: 0.34 },
      { x: 0.28, y: 0.66 },
      { x: 0.5, y: 0.66 },
      { x: 0.72, y: 0.66 },
    ],
  },
  8: {
    radius: 0.11,
    spots: [
      { x: 0.2, y: 0.36 },
      { x: 0.4, y: 0.36 },
      { x: 0.6, y: 0.36 },
      { x: 0.8, y: 0.36 },
      { x: 0.2, y: 0.64 },
      { x: 0.4, y: 0.64 },
      { x: 0.6, y: 0.64 },
      { x: 0.8, y: 0.64 },
    ],
  },
  [BULLET_RAIN_FROM]: {
    radius: 0.1,
    spots: [
      { x: 0.25, y: 0.2 },
      { x: 0.5, y: 0.14 },
      { x: 0.75, y: 0.24 },
      { x: 0.16, y: 0.5 },
      { x: 0.42, y: 0.46 },
      { x: 0.68, y: 0.52 },
      { x: 0.28, y: 0.78 },
      { x: 0.55, y: 0.8 },
      { x: 0.8, y: 0.74 },
    ],
  },
});

const BULLET_CLUSTER_COUNTS: readonly number[] = Object.freeze(
  sortBy(map(keys(BULLET_CLUSTERS), Number)),
);

export const getBulletCluster = (count: number): BulletCluster =>
  BULLET_CLUSTERS[
    findLast(
      BULLET_CLUSTER_COUNTS,
      (clusterCount) => clusterCount <= round(count),
    ) ?? 1
  ];
