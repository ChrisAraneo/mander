import { chain } from '@mander/utils';
import { CANNONBALL_SIZE } from '@mander/engine';
import type { Cannonball } from '@mander/model';
import { match } from 'ts-pattern';

import {
  applyStyle,
  applyStyleWith,
  beginPath,
  type CanvasStep,
  createRadialGradient,
  fill,
  restore,
  save,
  scale,
  sequence,
  traceArc,
  traceEllipse,
  translate,
} from '../canvas';
import { outline } from '../stroke';

const RADIUS = CANNONBALL_SIZE / 2;

const TRAIL_LENGTH = 15;
const TRAIL_HEIGHT = 3.2;

const IRON_LIGHT = '#7C8496';
const IRON_DARK = '#171C26';
const TRAIL_COLOR = 'RGBA(255, 158, 61, 0.45)';
const SHINE_COLOR = 'RGBA(255, 255, 255, 0.55)';

const drawTrail: CanvasStep = sequence([
  applyStyle({ fillStyle: TRAIL_COLOR }),
  beginPath,
  traceEllipse(
    -TRAIL_LENGTH / 2,
    0,
    TRAIL_LENGTH,
    TRAIL_HEIGHT,
    0,
    0,
    Math.PI * 2,
  ),
  fill,
]);

const drawIron: CanvasStep = sequence([
  beginPath,
  traceArc(0, 0, RADIUS, 0, Math.PI * 2),
  outline(),
  applyStyleWith((context) => ({
    fillStyle: createRadialGradient(
      context,
      -RADIUS / 3,
      -RADIUS / 3,
      1,
      0,
      0,
      RADIUS,
      [
        [0, IRON_LIGHT],
        [1, IRON_DARK],
      ],
    ),
  })),
  fill,
  applyStyle({ fillStyle: SHINE_COLOR }),
  beginPath,
  traceArc(-RADIUS / 3, -RADIUS / 3, RADIUS / 4, 0, Math.PI * 2),
  fill,
]);

const getFacing = (cannonball: Cannonball): number =>
  match(cannonball.velocity.x.current < 0)
    .with(true, () => -1)
    .otherwise(() => 1);

export const createCannonballStep = (cannonball: Cannonball): CanvasStep =>
  chain(getFacing(cannonball))
    .thru((facing) =>
      sequence([
        save,
        translate(
          cannonball.position.x + RADIUS,
          cannonball.position.y + RADIUS,
        ),
        scale(facing, 1),
        drawTrail,
        drawIron,
        restore,
      ]),
    )
    .value();
