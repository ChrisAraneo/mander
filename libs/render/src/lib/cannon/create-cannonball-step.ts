import { CANNONBALL_SIZE } from '@mander/engine';
import type { Cannonball } from '@mander/model';
import { createProjectileStep } from '../projectile/create-projectile-step';
import { createShadedSphereStep } from '../sphere/create-shaded-sphere-step';
import type { SphereColors } from '../sphere/types/sphere-colors';
import { createTrailStep } from '../trail/create-trail-step';
import type { CanvasStep } from '../types/canvas-step';

const CANNONBALL_RADIUS = CANNONBALL_SIZE / 2;

const CANNONBALL_IRON: SphereColors = {
  light: '#7C8496',
  deep: '#171C26',
  shine: 'RGBA(255, 255, 255, 0.55)',
};

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
