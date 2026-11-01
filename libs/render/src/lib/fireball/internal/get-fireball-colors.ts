import type { Fireball } from '@mander/model';
import { match } from 'ts-pattern';
import { BLOSSOM_FIREBALL, EMBER_FIREBALL, FROST_FIREBALL } from '../consts';
import type { FireballColors } from '../types/fireball-colors';

export const getFireballColors = (fireball: Fireball): FireballColors =>
  match(fireball.kind)
    .with('ICE', () => FROST_FIREBALL)
    .with('PINK', () => BLOSSOM_FIREBALL)
    .otherwise(() => EMBER_FIREBALL);
