import { createRandom } from '@mander/utils';

export const MIRROR_CHANCE = 0.3;

export const isMirrored = (seed: string): boolean =>
  createRandom(`${seed}#mirror`).chance(MIRROR_CHANCE);
