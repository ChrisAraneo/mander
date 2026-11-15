import { clamp } from 'lodash-es';

export const computeRampedVelocityX = (
  currentVelocityX: number,
  targetVelocityX: number,
  maxChange: number,
): number =>
  currentVelocityX +
  clamp(targetVelocityX - currentVelocityX, -maxChange, maxChange);
