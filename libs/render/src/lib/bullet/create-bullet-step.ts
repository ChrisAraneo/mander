import { BULLET_SIZE } from '@mander/engine';
import type { Bullet } from '@mander/model';
import { match } from 'ts-pattern';

import {
  applyStyle,
  beginPath,
  type CanvasStep,
  fill,
  restore,
  save,
  scale,
  sequence,
  traceEllipse,
  translate,
} from '../canvas';
import { createBulletBodyStep } from './create-bullet-body-step';
import { ICE_BULLET } from './consts';

const RADIUS = BULLET_SIZE / 2;

const TRAIL_LENGTH = 18;
const TRAIL_HEIGHT = 2.8;

const drawTrail: CanvasStep = sequence([
  applyStyle({ fillStyle: ICE_BULLET.trail }),
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

const getFacing = (bullet: Bullet): number =>
  match(bullet.velocity.x.current < 0)
    .with(true, () => -1)
    .otherwise(() => 1);

export const createBulletStep = (bullet: Bullet): CanvasStep =>
  sequence([
    save,
    translate(bullet.position.x + RADIUS, bullet.position.y + RADIUS),
    scale(getFacing(bullet), 1),
    drawTrail,
    createBulletBodyStep(0, 0, RADIUS, ICE_BULLET),
    restore,
  ]);
