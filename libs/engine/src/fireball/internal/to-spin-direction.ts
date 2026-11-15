import type { FireballSpin } from '@mander/model';
import { match } from 'ts-pattern';

export const toSpinDirection = (spin: FireballSpin): number =>
  match(spin)
    .with('CLOCKWISE', () => 1)
    .with('ANTICLOCKWISE', () => -1)
    .exhaustive(() => 1);
