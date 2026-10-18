import { BULLET_SIZE } from '@mander/engine';
import type { Bullet } from '@mander/model';
import { createProjectileStep } from '../projectile/create-projectile-step';
import { createShadedSphereStep } from '../sphere/create-shaded-sphere-step';
import { createTrailStep } from '../trail/create-trail-step';
import type { CanvasStep } from '../types/canvas-step';
import { ICE_BULLET } from './consts';

const RADIUS = BULLET_SIZE / 2;

const TRAIL_LENGTH = 18;

const TRAIL_HEIGHT = 2.8;

export const createBulletStep = (bullet: Bullet): CanvasStep =>
  createProjectileStep(
    bullet.position,
    RADIUS,
    bullet.velocity.x.current,
    createTrailStep(ICE_BULLET.trail, TRAIL_LENGTH, TRAIL_HEIGHT),
    createShadedSphereStep(0, 0, RADIUS, ICE_BULLET),
  );
