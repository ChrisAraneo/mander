import { chain } from '@mander/utils';
import type { Point } from '@mander/utils';
import { floor, map, times } from 'lodash-es';

import {
  applyStyle,
  beginPath,
  closePath,
  fill,
  moveTo,
  paint,
  sequence,
  traceLineTo,
} from '../canvas';
import type { Viewport } from '../viewport';
import type { HillLayer } from './hill-layer';

const HILL_STEP = 16;

const listStepsAcross = (width: number): number[] =>
  times(floor(width / HILL_STEP) + 1, (index) => index * HILL_STEP);

const getHillPoint = (
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
      map(listStepsAcross(viewport.width), (screenX) =>
        getHillPoint(screenX, cameraX, layer, baseline),
      ),
    )
    .thru((points) =>
      paint(
        context,
        applyStyle({ fillStyle: color }),
        beginPath,
        moveTo(0, viewport.height),
        sequence(map(points, ({ x, y }) => traceLineTo(x, y))),
        traceLineTo(viewport.width, viewport.height),
        closePath,
        fill,
      ),
    )
    .value();
