import { isIceball } from '@mander/engine';
import type { Fireball } from '@mander/model';
import { match } from 'ts-pattern';
import { EMBER_FIREBALL, FROST_FIREBALL } from '../consts';
import type { FireballColors } from '../types/fireball-colors';

export const getFireballColors = (fireball: Fireball): FireballColors =>
  match(isIceball(fireball))
    .with(true, () => FROST_FIREBALL)
    .otherwise(() => EMBER_FIREBALL);
