import {
  computeSpikeTriangles,
  type Level,
  spikeOrientation,
  spikeShape,
} from '@mander/engine';
import type { Triangle } from '@mander/utils';
import { chain, map } from 'lodash-es';

import type { CanvasStep } from '../canvas/canvas-step';
import {
  beginPath,
  closePath,
  fill,
  lineTo,
  moveTo,
  styledWith,
} from '../canvas/commands';
import { type ColorStop, linearGradient } from '../canvas/gradient';
import { paint, sequence } from '../canvas/paint';
import { outline } from '../stroke/stroke';

const SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#8B90A3'],
  [1, '#DFE3EE'],
];

const prongStep = ([left, apex, right]: Triangle): CanvasStep =>
  sequence([
    beginPath,
    moveTo(left.x, left.y),
    lineTo(apex.x, apex.y),
    lineTo(right.x, right.y),
    closePath,
    outline(),
    styledWith((context) => ({
      fillStyle: linearGradient(
        context,
        left.x,
        left.y,
        left.x,
        apex.y,
        SPIKE_STOPS,
      ),
    })),
    fill,
  ]);

export const spikeStep = (
  level: Level,
  tileX: number,
  tileY: number,
): CanvasStep =>
  chain(
    computeSpikeTriangles(
      tileX,
      tileY,
      spikeOrientation(level, tileX, tileY),
      spikeShape(level, tileX, tileY),
    ),
  )
    .thru((triangles) => map(triangles, prongStep))
    .thru(sequence)
    .value();

export const drawSpike = (
  context: CanvasRenderingContext2D,
  level: Level,
  tileX: number,
  tileY: number,
): void => paint(context, spikeStep(level, tileX, tileY));
