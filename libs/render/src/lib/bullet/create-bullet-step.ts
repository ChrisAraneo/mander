import { BULLET_SIZE } from '@mander/engine';
import type { Bullet } from '@mander/model';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeVelocityFacing } from '../compute-velocity-facing';
import type { CanvasStep } from '../types/canvas-step';
import { ICE_BULLET } from './consts';
import { createBulletBodyStep } from './create-bullet-body-step';
import { drawBulletTrail } from './internal/draw-bullet-trail';

const RADIUS = BULLET_SIZE / 2;

export const createBulletStep = (bullet: Bullet): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(bullet.position.x + RADIUS, bullet.position.y + RADIUS),
    createScaleStep(computeVelocityFacing(bullet.velocity.x.current), 1),
    drawBulletTrail,
    createBulletBodyStep(0, 0, RADIUS, ICE_BULLET),
    drawRestore,
  ]);
