import type { Item } from '@mander/model';
import { clamp, map } from 'lodash-es';
import { match } from 'ts-pattern';

import { type CanvasStep, paint, sequence } from '../canvas';
import { gemStep } from '../gem';
import { starStep } from '../star';
import { heartStep } from './heart-step';
import { type ItemArt, itemArt } from './item-art';

interface HeartSpot {
  x: number;
  y: number;
}

interface HeartCluster {
  lobe: number;
  spots: readonly HeartSpot[];
}

const GEM_WIDTH = 0.34;
const GEM_HEIGHT = 0.42;
const GEM_GLOW = 18;

const STAR_RADIUS = 0.42;
const STAR_GLOW = 20;

const HEART_LOBE = 0.26;

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

const clusterFor = (count: number): HeartCluster =>
  CLUSTERS[clamp(Math.round(count), 1, 3)];

const heartsStep = (count: number, size: number): CanvasStep => {
  const cluster = clusterFor(count);

  return sequence(
    map(cluster.spots, (spot) =>
      heartStep(size * spot.x, size * spot.y, size * HEART_LOBE * cluster.lobe),
    ),
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
    .with({ kind: 'STAR' }, ({ colors }) =>
      starStep(size / 2, size * 0.52, size * STAR_RADIUS, colors, STAR_GLOW),
    )
    .exhaustive();

export const drawItem = (
  context: CanvasRenderingContext2D,
  item: Item,
  size: number,
): void => paint(context, artStep(itemArt(item), size));
