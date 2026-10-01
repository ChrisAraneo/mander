import { wrapHue } from '@mander/utils';
import { match, P } from 'ts-pattern';

const { number } = P;

const ENTITY_HUE = 24;

const ENTITY_HUE_GUARD = 30;

const FULL_TURN = 360;

const HALF_TURN = 180;

export const pushAwayFromEntityHue = (hue: number): number =>
  match(wrapHue(hue - ENTITY_HUE))
    .with(
      number.between(ENTITY_HUE_GUARD, FULL_TURN - ENTITY_HUE_GUARD),
      () => hue,
    )
    .with(number.lte(HALF_TURN), () => wrapHue(ENTITY_HUE + ENTITY_HUE_GUARD))
    .otherwise(() => wrapHue(ENTITY_HUE - ENTITY_HUE_GUARD));
