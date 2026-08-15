import type { Item } from '@mander/model';
import { clamp, map, times } from 'lodash-es';
import { match } from 'ts-pattern';

import { bulletBodyStep, ICE_BULLET } from '../bullet';
import { type CanvasStep, paint, sequence } from '../canvas';
import { flameStep, WHITE_FIREBALL } from '../fireball';
import { bootStep, helmetStep } from '../gear';
import { gemStep } from '../gem';
import { type StarColors, starStep } from '../star';
import { heartStep } from './heart-step';
import { type ItemArt, itemArt } from './item-art';

interface Spot {
  x: number;
  y: number;
}

interface HeartCluster {
  lobe: number;
  spots: readonly Spot[];
}

interface BulletCluster {
  radius: number;
  spots: readonly Spot[];
}

interface StarCluster {
  radius: number;
  spots: readonly Spot[];
}

const GEM_WIDTH = 0.34;
const GEM_HEIGHT = 0.42;
const GEM_GLOW = 18;

const STAR_GLOW = 20;

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

const HEART_LOBE = 0.26;

const BULLET_GLOW = 14;
const BULLET_RAIN_FROM = 5;

const ORBIT_RADIUS = 0.27;
const FIREBALL_RADIUS = 0.15;
const FIREBALL_TAIL = 0.34;
const FIRST_ORBIT = -Math.PI / 2;

const CLUSTERS: Readonly<Record<number, HeartCluster>> = Object.freeze({
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

const clusterFor = (count: number): HeartCluster =>
  CLUSTERS[clamp(Math.round(count), 1, 3)];

const bulletClusterFor = (count: number): BulletCluster =>
  BULLET_CLUSTERS[clamp(Math.round(count), 1, BULLET_RAIN_FROM)];

const starClusterFor = (count: number): StarCluster =>
  STAR_CLUSTERS[clamp(Math.round(count), 1, 3)];

const heartsStep = (count: number, size: number): CanvasStep => {
  const cluster = clusterFor(count);

  return sequence(
    map(cluster.spots, (spot) =>
      heartStep(size * spot.x, size * spot.y, size * HEART_LOBE * cluster.lobe),
    ),
  );
};

const bulletsStep = (count: number, size: number): CanvasStep => {
  const cluster = bulletClusterFor(count);

  return sequence(
    map(cluster.spots, (spot) =>
      bulletBodyStep(
        size * spot.x,
        size * spot.y,
        size * cluster.radius,
        ICE_BULLET,
        BULLET_GLOW,
      ),
    ),
  );
};

const starsStep = (
  count: number,
  size: number,
  colors: StarColors,
): CanvasStep => {
  const cluster = starClusterFor(count);

  return sequence(
    map(cluster.spots, (spot) =>
      starStep(
        size * spot.x,
        size * spot.y,
        size * cluster.radius,
        colors,
        STAR_GLOW,
      ),
    ),
  );
};

const fireballsStep = (count: number, size: number): CanvasStep => {
  const orbiting = Math.max(1, Math.round(count));
  const centre = size / 2;

  return sequence(
    times(orbiting, (index) => {
      const angle = FIRST_ORBIT + (index * Math.PI * 2) / orbiting;

      return flameStep(
        {
          x: centre + Math.cos(angle) * size * ORBIT_RADIUS,
          y: centre + Math.sin(angle) * size * ORBIT_RADIUS,
        },
        angle + Math.PI / 2,
        size * FIREBALL_RADIUS,
        WHITE_FIREBALL,
        size * FIREBALL_TAIL,
      );
    }),
  );
};

const artStep = (art: ItemArt, size: number): CanvasStep =>
  match(art)
    .with({ kind: 'HEARTS' }, ({ count }) => heartsStep(count, size))
    .with({ kind: 'GEM' }, ({ colors }) =>
      gemStep(
        size / 2,
        size / 2,
        size * GEM_WIDTH,
        size * GEM_HEIGHT,
        colors,
        GEM_GLOW,
      ),
    )
    .with({ kind: 'STARS' }, ({ count, colors }) =>
      starsStep(count, size, colors),
    )
    .with({ kind: 'BULLETS' }, ({ count }) => bulletsStep(count, size))
    .with({ kind: 'FIREBALLS' }, ({ count }) => fireballsStep(count, size))
    .with({ kind: 'BOOTS' }, () => bootStep(0, 0, size))
    .with({ kind: 'HELMET' }, () => helmetStep(0, 0, size))
    .exhaustive();

export const drawItem = (
  context: CanvasRenderingContext2D,
  item: Item,
  size: number,
): void => paint(context, artStep(itemArt(item), size));
