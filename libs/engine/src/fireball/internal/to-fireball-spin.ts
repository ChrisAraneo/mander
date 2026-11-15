import type { FireballSpin } from '@mander/model';
import { match } from 'ts-pattern';

export const toFireballSpin = (isAnticlockwise: boolean): FireballSpin =>
  match(isAnticlockwise)
    .with(true, (): FireballSpin => 'ANTICLOCKWISE')
    .otherwise((): FireballSpin => 'CLOCKWISE');
