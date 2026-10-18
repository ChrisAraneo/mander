import {
  computeSpikeTriangles,
  getSpikeOrientation,
  getSpikeShape,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { createSequenceStep } from '../canvas/create-sequence-step';
import type { CanvasStep } from '../types/canvas-step';
import { createProngStep } from './create-prong-step';

export const createSpikeStep = (
  level: Level,
  column: number,
  row: number,
): CanvasStep =>
  chain(
    computeSpikeTriangles(
      column * TILE_SIZE,
      row * TILE_SIZE,
      getSpikeOrientation(level, column, row),
      getSpikeShape(level, column, row),
    ),
  )
    .thru((triangles) =>
      map(triangles, (triangle) => createProngStep(triangle)),
    )
    .thru(createSequenceStep)
    .value();
