import type { FireballSpin } from '@mander/model';
import { match } from 'ts-pattern';

export const getSpinDirection = (spin: FireballSpin): number =>
  match(spin)
    .with('ANTICLOCKWISE', () => -1)
    .otherwise(() => 1);
