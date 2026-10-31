import { SNOWBALL_SIZE } from '@mander/engine';
import type { Snowball } from '@mander/model';
import { createProjectileStep } from '../projectile/create-projectile-step';
import { createShadedSphereStep } from '../sphere/create-shaded-sphere-step';
import type { SphereColors } from '../sphere/types/sphere-colors';
import { createTrailStep } from '../trail/create-trail-step';
import type { CanvasStep } from '../types/canvas-step';

const SNOWBALL_RADIUS = SNOWBALL_SIZE / 2;

const SNOWBALL_SNOW: SphereColors = {
  light: '#FFFFFF',
  deep: '#9FC4DA',
  shine: 'RGBA(255, 255, 255, 0.85)',
};

const TRAIL_LENGTH = 15;

const TRAIL_HEIGHT = 3.2;

const TRAIL_COLOR = 'RGBA(214, 240, 255, 0.45)';

export const createSnowballStep = (snowball: Snowball): CanvasStep =>
  createProjectileStep(
    snowball.position,
    SNOWBALL_RADIUS,
    snowball.velocity.x.current,
    createTrailStep(TRAIL_COLOR, TRAIL_LENGTH, TRAIL_HEIGHT),
    createShadedSphereStep(0, 0, SNOWBALL_RADIUS, SNOWBALL_SNOW),
  );
