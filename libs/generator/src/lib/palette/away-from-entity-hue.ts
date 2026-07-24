import { match } from 'ts-pattern';

import { ENTITY_HUE, ENTITY_HUE_GUARD } from './constants';
import { wrapHue } from './wrap-hue';

/**
 * Nudges a hue out of the warm band the player and the enemies live in, so a
 * rolled palette never camouflages a body against the ground it stands on.
 */
export const awayFromEntityHue = (hue: number): number =>
  match(wrapHue(hue - ENTITY_HUE))
    .when(
      (gap) => gap >= ENTITY_HUE_GUARD && gap <= 360 - ENTITY_HUE_GUARD,
      () => hue,
    )
    .when(
      (gap) => gap <= 180,
      () => wrapHue(ENTITY_HUE + ENTITY_HUE_GUARD),
    )
    .otherwise(() => wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD));
