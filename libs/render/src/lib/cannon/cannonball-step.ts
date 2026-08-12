import { CANNONBALL_SIZE } from '@mander/engine';
import type { Cannonball } from '@mander/model';
import { chain } from 'lodash-es';
import { match } from 'ts-pattern';

import {
  arc,
  beginPath,
  type CanvasStep,
  ellipse,
  fill,
  radialGradient,
  restore,
  save,
  scale,
  sequence,
  styled,
  styledWith,
  translate,
} from '../canvas';
import { outline } from '../stroke';

const RADIUS = CANNONBALL_SIZE / 2;

const TRAIL_LENGTH = 15;
const TRAIL_HEIGHT = 3.2;

const IRON_LIGHT = '#7C8496';
const IRON_DARK = '#171C26';
const TRAIL_COLOR = 'RGBA(255, 158, 61, 0.45)';
const GLOW_COLOR = '#FF9E3D';
const GLOW_BLUR = 10;
const SHINE_COLOR = 'RGBA(255, 255, 255, 0.55)';

const trailStep: CanvasStep = sequence([
  styled({ fillStyle: TRAIL_COLOR }),
  beginPath,
  ellipse(-TRAIL_LENGTH / 2, 0, TRAIL_LENGTH, TRAIL_HEIGHT, 0, 0, Math.PI * 2),
  fill,
]);

const ironStep: CanvasStep = sequence([
  beginPath,
  arc(0, 0, RADIUS, 0, Math.PI * 2),
  outline(),
  styledWith((context) => ({
    fillStyle: radialGradient(
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
  styled({ fillStyle: SHINE_COLOR }),
  beginPath,
  arc(-RADIUS / 3, -RADIUS / 3, RADIUS / 4, 0, Math.PI * 2),
  fill,
]);

const facingOf = (cannonball: Cannonball): number =>
  match(cannonball.velocity.x.current < 0)
    .with(true, () => -1)
    .otherwise(() => 1);

export const cannonballStep = (cannonball: Cannonball): CanvasStep =>
  chain(facingOf(cannonball))
    .thru((facing) =>
      sequence([
        save,
        translate(
          cannonball.position.x + RADIUS,
          cannonball.position.y + RADIUS,
        ),
        scale(facing, 1),
        styled({ shadowColor: GLOW_COLOR, shadowBlur: GLOW_BLUR }),
        trailStep,
        ironStep,
        restore,
      ]),
    )
    .value();
