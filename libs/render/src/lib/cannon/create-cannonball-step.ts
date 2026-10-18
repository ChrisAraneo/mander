import type { Cannonball } from '@mander/model';
import { createProjectileStep } from '../projectile/create-projectile-step';
import { createShadedSphereStep } from '../sphere/create-shaded-sphere-step';
import { createTrailStep } from '../trail/create-trail-step';
import type { CanvasStep } from '../types/canvas-step';
import { CANNONBALL_IRON, CANNONBALL_RADIUS } from './internal/consts';

const TRAIL_LENGTH = 15;

const TRAIL_HEIGHT = 3.2;

const TRAIL_COLOR = 'RGBA(255, 158, 61, 0.45)';

export const createCannonballStep = (cannonball: Cannonball): CanvasStep =>
  createProjectileStep(
    cannonball.position,
    CANNONBALL_RADIUS,
    cannonball.velocity.x.current,
    createTrailStep(TRAIL_COLOR, TRAIL_LENGTH, TRAIL_HEIGHT),
    createShadedSphereStep(0, 0, CANNONBALL_RADIUS, CANNONBALL_IRON),
  );
