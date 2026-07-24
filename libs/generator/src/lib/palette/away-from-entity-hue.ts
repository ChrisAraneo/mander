import { ENTITY_HUE, ENTITY_HUE_GUARD } from './constants';
import { wrapHue } from './wrap-hue';

/**
 * Nudges a hue out of the warm band the player and the enemies live in, so a
 * rolled palette never camouflages a body against the ground it stands on.
 */
export const awayFromEntityHue = (hue: number): number => {
  const gap = wrapHue(hue - ENTITY_HUE);
  if (gap >= ENTITY_HUE_GUARD && gap <= 360 - ENTITY_HUE_GUARD) return hue;
  if (gap <= 180) return wrapHue(ENTITY_HUE + ENTITY_HUE_GUARD);
  return wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD);
};
