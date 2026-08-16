import { chain } from '@mander/utils';
import type { Point } from '@mander/utils';
import { floor, map, times } from 'lodash-es';

import {
  beginPath,
  closePath,
  fill,
  lineTo,
  moveTo,
  paint,
  sequence,
  styled,
} from '../canvas';
import type { Viewport } from '../viewport';
import type { HillLayer } from './hill-layer';

const HILL_STEP = 16;

const stepsAcross = (width: number): number[] =>
  times(floor(width / HILL_STEP) + 1, (index) => index * HILL_STEP);

const hillPoint = (
  screenX: number,
  cameraX: number,
  layer: HillLayer,
  baseline: number,
): Point =>
  chain((screenX + cameraX * layer.parallax) / 210)
    .thru((worldPhase) => ({
      x: screenX,
      y:
        baseline -
        (Math.sin(worldPhase) + Math.sin(worldPhase * 2.3) * 0.4) *
          layer.amplitude,
    }))
    .value();

export const drawHillLayer = (
  context: CanvasRenderingContext2D,
  cameraX: number,
  layer: HillLayer,
  color: string,
  viewport: Viewport,
): void =>
  chain(viewport.height * layer.baselineRatio)
    .thru((baseline) =>
      map(stepsAcross(viewport.width), (screenX) =>
        hillPoint(screenX, cameraX, layer, baseline),
      ),
    )
    .thru((points) =>
      paint(
        context,
        styled({ fillStyle: color }),
        beginPath,
        moveTo(0, viewport.height),
        sequence(map(points, ({ x, y }) => lineTo(x, y))),
        lineTo(viewport.width, viewport.height),
        closePath,
        fill,
      ),
    )
    .value();
