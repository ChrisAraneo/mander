import type { Fireball } from '@mander/model';
import { toCounterPinkball } from './to-counter-pinkball';

export const createPinkballPair = (pinkball: Fireball): Fireball[] => [
  pinkball,
  toCounterPinkball(pinkball),
];
