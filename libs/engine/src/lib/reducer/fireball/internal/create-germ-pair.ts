import type { Fireball, Point } from '@mander/model';
import { pipe } from 'remeda';
import type { Random } from '../../../random/types/random';
import { createSpinningFireball } from './create-spinning-fireball';
import { toCounterGerm } from './to-counter-germ';

export const createGermPair = (tile: Point, random: Random): Fireball[] =>
  pipe(createSpinningFireball('PINK', tile, random), (germ) => [
    germ,
    toCounterGerm(germ),
  ]);
