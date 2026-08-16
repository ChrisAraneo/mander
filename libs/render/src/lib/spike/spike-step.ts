import { chain } from '@mander/utils';
import {
  computeSpikeTriangles,
  type Level,
  spikeOrientation,
  spikeShape,
} from '@mander/model';
import type { Triangle } from '@mander/utils';
import { map } from 'lodash-es';

import {
  beginPath,
  type CanvasStep,
  closePath,
  type ColorStop,
  fill,
  lineTo,
  linearGradient,
  moveTo,
  sequence,
  styledWith,
} from '../canvas';
import { outline } from '../stroke';

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
