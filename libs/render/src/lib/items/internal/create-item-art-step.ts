import { match } from 'ts-pattern';
import { createGemShapeStep } from '../../gem-shape/create-gem-shape-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { ItemArt } from '../types/item-art';
import { createItemBulletsStep } from './create-item-bullets-step';
import { createItemHeartsStep } from './create-item-hearts-step';
import { createItemStarsStep } from './create-item-stars-step';

const GEM_WIDTH = 0.34;

const GEM_HEIGHT = 0.42;

export const createItemArtStep = (art: ItemArt, size: number): CanvasStep =>
  match(art)
    .with({ kind: 'HEARTS' }, ({ count }) => createItemHeartsStep(count, size))
    .with({ kind: 'GEM' }, ({ colors }) =>
      createGemShapeStep(
        size / 2,
        size / 2,
        size * GEM_WIDTH,
        size * GEM_HEIGHT,
        colors,
      ),
    )
    .with({ kind: 'STARS' }, ({ count, colors }) =>
      createItemStarsStep(count, size, colors),
    )
    .with({ kind: 'BULLETS' }, ({ count }) =>
      createItemBulletsStep(count, size),
    )
    .exhaustive();
