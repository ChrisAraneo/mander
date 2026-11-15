import { type Random } from '@mander/common';
import type { Fireball, Point } from '@mander/model';
import { createPinkballPair } from './create-pinkball-pair';
import { createSpinningFireball } from './create-spinning-fireball';

export const createPinkballs = (tile: Point, random: Random): Fireball[] =>
  createPinkballPair(createSpinningFireball('PINK', tile, random));
