import {
  computeSpikeTriangles,
  getSpikeOrientation,
  getSpikeShape,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createSequenceStep } from '../canvas/create-sequence-step';
import type { CanvasStep } from '../types/canvas-step';
import { createProngStep } from './create-prong-step';

export const createSpikeStep = (
  level: Level,
  column: number,
  row: number,
): CanvasStep =>
  pipe(
    computeSpikeTriangles(
      column * TILE_SIZE,
      row * TILE_SIZE,
      getSpikeOrientation(level, column, row),
      getSpikeShape(level, column, row),
    ),
    (triangles) => map(triangles, (triangle) => createProngStep(triangle)),
    createSequenceStep,
  );
