import type { ItemCluster } from './types/item-cluster';

export const HEART_TIP = 1.7;

export const HEART_CLUSTERS: Readonly<Record<number, ItemCluster>> =
  Object.freeze({
    1: { scale: 1, spots: [{ x: 0.5, y: 0.46 }] },
    2: {
      scale: 0.66,
      spots: [
        { x: 0.34, y: 0.32 },
        { x: 0.65, y: 0.6 },
      ],
    },
    3: {
      scale: 0.58,
      spots: [
        { x: 0.5, y: 0.26 },
        { x: 0.3, y: 0.62 },
        { x: 0.72, y: 0.6 },
      ],
    },
  });

export const STAR_CLUSTERS: Readonly<Record<number, ItemCluster>> =
  Object.freeze({
    1: { scale: 0.42, spots: [{ x: 0.5, y: 0.52 }] },
    2: {
      scale: 0.3,
      spots: [
        { x: 0.36, y: 0.38 },
        { x: 0.66, y: 0.66 },
      ],
    },
    3: {
      scale: 0.24,
      spots: [
        { x: 0.5, y: 0.3 },
        { x: 0.29, y: 0.68 },
        { x: 0.71, y: 0.68 },
      ],
    },
  });

export const BULLET_CLUSTERS: Readonly<Record<number, ItemCluster>> =
  Object.freeze({
    1: { scale: 0.22, spots: [{ x: 0.5, y: 0.5 }] },
    2: {
      scale: 0.19,
      spots: [
        { x: 0.35, y: 0.37 },
        { x: 0.65, y: 0.63 },
      ],
    },
    3: {
      scale: 0.17,
      spots: [
        { x: 0.5, y: 0.28 },
        { x: 0.31, y: 0.64 },
        { x: 0.69, y: 0.64 },
      ],
    },
    4: {
      scale: 0.15,
      spots: [
        { x: 0.34, y: 0.34 },
        { x: 0.66, y: 0.34 },
        { x: 0.34, y: 0.66 },
        { x: 0.66, y: 0.66 },
      ],
    },
    6: {
      scale: 0.13,
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
      scale: 0.11,
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
  });
