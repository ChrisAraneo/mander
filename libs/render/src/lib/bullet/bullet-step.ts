import { BULLET_SIZE } from '@mander/engine';
import type { Bullet } from '@mander/model';
import { match } from 'ts-pattern';

import {
  beginPath,
  type CanvasStep,
  ellipse,
  fill,
  restore,
  save,
  scale,
  sequence,
  styled,
  translate,
} from '../canvas';
import { bulletBodyStep } from './bullet-body-step';
import { BULLET_GLOW_BLUR, ICE_BULLET } from './consts';

const RADIUS = BULLET_SIZE / 2;

const TRAIL_LENGTH = 18;
const TRAIL_HEIGHT = 2.8;

const trailStep: CanvasStep = sequence([
  styled({ fillStyle: ICE_BULLET.trail }),
  beginPath,
  ellipse(-TRAIL_LENGTH / 2, 0, TRAIL_LENGTH, TRAIL_HEIGHT, 0, 0, Math.PI * 2),
  fill,
]);

const facingOf = (bullet: Bullet): number =>
  match(bullet.velocity.x.current < 0)
    .with(true, () => -1)
    .otherwise(() => 1);

export const bulletStep = (bullet: Bullet): CanvasStep =>
  sequence([
    save,
    translate(bullet.position.x + RADIUS, bullet.position.y + RADIUS),
    scale(facingOf(bullet), 1),
    styled({ shadowColor: ICE_BULLET.glow, shadowBlur: BULLET_GLOW_BLUR }),
    trailStep,
    bulletBodyStep(0, 0, RADIUS, ICE_BULLET, BULLET_GLOW_BLUR),
    restore,
  ]);
