import type { FireballSpin } from '@mander/model';
import { match } from 'ts-pattern';

export const toOppositeSpin = (spin: FireballSpin): FireballSpin =>
  match(spin)
    .with('CLOCKWISE', (): FireballSpin => 'ANTICLOCKWISE')
    .otherwise((): FireballSpin => 'CLOCKWISE');
